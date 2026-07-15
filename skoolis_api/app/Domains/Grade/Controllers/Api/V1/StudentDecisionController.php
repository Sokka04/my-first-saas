<?php

namespace App\Domains\Grade\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domains\Grade\Models\StudentDecision;
use App\Domains\Grade\Models\GradeThreshold;
use App\Domains\Grade\Models\Grade;
use App\Domains\Subject\Models\ClassSubject;
use App\Domains\Grade\Services\GradeCalculator;
use Illuminate\Support\Facades\Auth;

class StudentDecisionController extends Controller
{
    private GradeCalculator $calculator;

    public function __construct(GradeCalculator $calculator)
    {
        $this->calculator = $calculator;
    }

    public function index(Request $request)
    {
        $classId = $request->query('school_class_id');
        $yearId = $request->query('school_year_id');

        $query = StudentDecision::with(['student', 'decidedBy']);

        if ($yearId) {
            $query->where('school_year_id', $yearId);
        }

        // If classId is provided, we only want decisions for students in that class.
        // We can check if the student has grades in that class to verify enrollment, or use an enrollments table.
        // For simplicity, we filter by joining students.
        if ($classId) {
            $query->whereHas('student.grades', function ($q) use ($classId) {
                $q->where('school_class_id', $classId);
            });
        }

        $decisions = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $decisions
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|uuid',
            'school_year_id' => 'required|uuid',
        ]);

        $classId = $validated['school_class_id'];
        $yearId = $validated['school_year_id'];

        $thresholdObj = GradeThreshold::where('school_class_id', $classId)
            ->where('school_year_id', $yearId)
            ->first();
        $passingAverage = $thresholdObj ? $thresholdObj->passing_average : 10.00;

        $grades = Grade::with('student')->where('school_class_id', $classId)->get();
        $classSubjects = ClassSubject::where('school_class_id', $classId)->get()->keyBy('subject_id');
        $studentsGrades = $grades->groupBy('student_id');

        $results = [];

        foreach ($studentsGrades as $studentId => $studentGrades) {
            $subjectGrades = $studentGrades->groupBy('subject_id');
            $matieres = [];
            foreach ($subjectGrades as $subjectId => $gradesForSubject) {
                $cs = $classSubjects[$subjectId] ?? null;
                if ($cs) {
                    $moyennesPeriodiques = [];
                    foreach (['trimestre1', 'trimestre2', 'trimestre3', 'semestre1', 'semestre2'] as $period) {
                        $pGrade = $gradesForSubject->firstWhere('period', $period);
                        if ($pGrade) {
                            $moyennesPeriodiques[] = $this->calculator->calculateMoyenneMatiere(
                                $pGrade->interrogation,
                                $pGrade->devoir,
                                $pGrade->composition,
                                $pGrade->examen_pratique,
                                $cs->evaluation_type
                            );
                        }
                    }
                    $matieres[] = [
                        'moyenne' => $this->calculator->calculateMoyenneAnnuelleMatiere($moyennesPeriodiques),
                        'coefficient' => $cs->coefficient
                    ];
                }
            }

            $moyenneGenerale = $this->calculator->calculateMoyenneGenerale($matieres);
            
            if ($moyenneGenerale !== null) {
                $decisionValue = $moyenneGenerale >= $passingAverage ? 'admis' : 'redouble';

                $decision = StudentDecision::firstOrNew([
                    'student_id' => $studentId,
                    'school_year_id' => $yearId
                ]);

                if (!$decision->is_manual_override) {
                    $decision->annual_average = round($moyenneGenerale, 2);
                    $decision->decision = $decisionValue;
                    $decision->save();
                }

                $decision->load('student');
                $results[] = $decision;
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => collect($results)->sortByDesc('annual_average')->values()->all(),
            'threshold_used' => (float)$passingAverage
        ]);
    }

    public function override(Request $request, $id)
    {
        $validated = $request->validate([
            'decision' => 'required|string|in:admis,redouble,exclu'
        ]);

        $decision = StudentDecision::findOrFail($id);
        
        $decision->update([
            'decision' => $validated['decision'],
            'is_manual_override' => true,
            'decided_by' => Auth::id() ?? null,
            'decided_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $decision->load(['student', 'decidedBy'])
        ]);
    }
}
