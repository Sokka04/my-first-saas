<?php

namespace App\Domains\Grade\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domains\Grade\Models\Grade;
use App\Domains\Subject\Models\ClassSubject;
use App\Domains\Grade\Services\GradeCalculator;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    protected GradeCalculator $calculator;

    public function __construct(GradeCalculator $calculator)
    {
        $this->calculator = $calculator;
    }

    /**
     * Obtenir les notes (avec filtres optionnels)
     */
    public function index(Request $request)
    {
        $query = Grade::with(['student', 'subject', 'schoolClass']);

        if ($request->has('class_id') && $request->class_id) {
            $query->where('school_class_id', $request->class_id);
        }
        if ($request->has('subject_id') && $request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->has('period') && $request->period) {
            $query->where('period', $request->period);
        }
        if ($request->has('student_id') && $request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        $grades = $query->get();

        // Récupérer les types d'évaluation
        $classSubjectTypes = [];
        foreach ($grades as $grade) {
            $key = $grade->school_class_id . '_' . $grade->subject_id;
            if (!isset($classSubjectTypes[$key])) {
                $cs = ClassSubject::where('school_class_id', $grade->school_class_id)
                                  ->where('subject_id', $grade->subject_id)
                                  ->first();
                $classSubjectTypes[$key] = $cs ? $cs->evaluation_type : 'composition';
            }
        }

        // Ajouter les champs calculés
        $grades->transform(function ($grade) use ($classSubjectTypes) {
            $key = $grade->school_class_id . '_' . $grade->subject_id;
            $evalType = $classSubjectTypes[$key];

            $noteClasse = $this->calculator->calculateNoteClasse($grade->interrogation, $grade->devoir);
            $moyenne = $this->calculator->calculateMoyenneMatiere(
                $grade->interrogation,
                $grade->devoir,
                $grade->composition,
                $grade->examen_pratique,
                $evalType
            );

            $grade->note_classe = $noteClasse;
            $grade->moyenne_matiere = $moyenne;
            return $grade;
        });

        // Calculer les rangs si class_id et period et subject_id sont fournis (classement par matière)
        if ($request->has('class_id') && $request->has('subject_id') && $request->has('period')) {
            $moyennes = [];
            foreach ($grades as $grade) {
                $moyennes[$grade->student_id] = $grade->moyenne_matiere;
            }
            $ranking = $this->calculator->calculateRanking($moyennes);
            
            $grades->transform(function ($grade) use ($ranking) {
                $grade->rank = $ranking[$grade->student_id] ?? null;
                return $grade;
            });
        }

        return response()->json([
            'status' => 'success',
            'data' => $grades
        ]);
    }

    /**
     * Saisie par lot (Bulk)
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|uuid',
            'subject_id' => 'required|uuid',
            'period' => 'required|string',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|uuid',
            'grades.*.interrogation' => 'nullable|numeric|min:0|max:20',
            'grades.*.devoir' => 'nullable|numeric|min:0|max:20',
            'grades.*.composition' => 'nullable|numeric|min:0|max:20',
            'grades.*.examen_pratique' => 'nullable|numeric|min:0|max:20',
            'grades.*.appreciation' => 'nullable|string'
        ]);

        $classId = $validated['school_class_id'];
        $subjectId = $validated['subject_id'];
        $period = $validated['period'];

        DB::beginTransaction();
        try {
            foreach ($validated['grades'] as $gradeData) {
                Grade::updateOrCreate(
                    [
                        'student_id' => $gradeData['student_id'],
                        'school_class_id' => $classId,
                        'subject_id' => $subjectId,
                        'period' => $period,
                    ],
                    [
                        'interrogation' => $gradeData['interrogation'] ?? null,
                        'devoir' => $gradeData['devoir'] ?? null,
                        'composition' => $gradeData['composition'] ?? null,
                        'examen_pratique' => $gradeData['examen_pratique'] ?? null,
                        'appreciation' => $gradeData['appreciation'] ?? null,
                    ]
                );
            }
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Notes enregistrées avec succès'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'enregistrement des notes'
            ], 500);
        }
    }

    /**
     * Mettre à jour une note
     */
    public function update(Request $request, $id)
    {
        $grade = Grade::findOrFail($id);
        
        $validated = $request->validate([
            'interrogation' => 'nullable|numeric|min:0|max:20',
            'devoir' => 'nullable|numeric|min:0|max:20',
            'composition' => 'nullable|numeric|min:0|max:20',
            'examen_pratique' => 'nullable|numeric|min:0|max:20',
            'appreciation' => 'nullable|string'
        ]);

        $grade->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $grade
        ]);
    }

    /**
     * Supprimer une note
     */
    public function destroy($id)
    {
        $grade = Grade::findOrFail($id);
        $grade->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Note supprimée'
        ]);
    }

    /**
     * Moyenne périodique pour un élève
     */
    public function studentPeriodAverage($studentId, Request $request)
    {
        $period = $request->query('period');
        if (!$period) return response()->json(['error' => 'period required'], 400);

        $grades = Grade::where('student_id', $studentId)
                       ->where('period', $period)
                       ->get();

        if ($grades->isEmpty()) {
            return response()->json(['status' => 'success', 'moyenne_generale' => null]);
        }

        $classId = $grades->first()->school_class_id;
        $classSubjects = ClassSubject::where('school_class_id', $classId)->get()->keyBy('subject_id');

        $matieres = [];
        foreach ($grades as $grade) {
            $cs = $classSubjects[$grade->subject_id] ?? null;
            if ($cs) {
                $moyenne = $this->calculator->calculateMoyenneMatiere(
                    $grade->interrogation,
                    $grade->devoir,
                    $grade->composition,
                    $grade->examen_pratique,
                    $cs->evaluation_type
                );
                $matieres[] = [
                    'moyenne' => $moyenne,
                    'coefficient' => $cs->coefficient
                ];
            }
        }

        $moyenneGenerale = $this->calculator->calculateMoyenneGenerale($matieres);

        return response()->json([
            'status' => 'success',
            'moyenne_generale' => $moyenneGenerale
        ]);
    }

    /**
     * Moyennes générales périodiques pour toute une classe
     */
    public function classPeriodAverages($classId, Request $request)
    {
        $period = $request->query('period');
        if (!$period) return response()->json(['error' => 'period required'], 400);

        // Récupérer toutes les notes de la classe pour cette période
        $grades = Grade::with('student')->where('school_class_id', $classId)
                       ->where('period', $period)
                       ->get();

        $classSubjects = ClassSubject::where('school_class_id', $classId)->get()->keyBy('subject_id');

        // Grouper les notes par étudiant
        $studentsGrades = $grades->groupBy('student_id');

        $results = [];
        $moyennesMap = [];

        foreach ($studentsGrades as $studentId => $studentGrades) {
            $matieres = [];
            foreach ($studentGrades as $grade) {
                $cs = $classSubjects[$grade->subject_id] ?? null;
                if ($cs) {
                    $moy = $this->calculator->calculateMoyenneMatiere(
                        $grade->interrogation,
                        $grade->devoir,
                        $grade->composition,
                        $grade->examen_pratique,
                        $cs->evaluation_type
                    );
                    $matieres[] = [
                        'moyenne' => $moy,
                        'coefficient' => $cs->coefficient
                    ];
                }
            }
            $moyenneGenerale = $this->calculator->calculateMoyenneGenerale($matieres);
            $moyennesMap[$studentId] = $moyenneGenerale;
            
            $results[$studentId] = [
                'student' => $studentGrades->first()->student,
                'moyenne_generale' => $moyenneGenerale
            ];
        }

        $ranking = $this->calculator->calculateRanking($moyennesMap);

        $finalList = [];
        foreach ($results as $studentId => $data) {
            $data['rank'] = $ranking[$studentId] ?? null;
            $finalList[] = $data;
        }

        // Trier par rang
        usort($finalList, function($a, $b) {
            return ($a['rank'] ?? 999) <=> ($b['rank'] ?? 999);
        });

        return response()->json([
            'status' => 'success',
            'data' => $finalList
        ]);
    }

    /**
     * Moyennes annuelles pour toute une classe
     */
    public function classAnnualAverages($classId)
    {
        // Récupérer toutes les notes de la classe pour toutes les périodes
        $grades = Grade::with('student')->where('school_class_id', $classId)->get();
        $classSubjects = ClassSubject::where('school_class_id', $classId)->get()->keyBy('subject_id');

        // Grouper par étudiant
        $studentsGrades = $grades->groupBy('student_id');

        $results = [];
        $moyennesMap = [];

        foreach ($studentsGrades as $studentId => $studentGrades) {
            // Pour chaque étudiant, grouper par matière puis par période
            $subjectGrades = $studentGrades->groupBy('subject_id');
            
            $matieres = [];
            foreach ($subjectGrades as $subjectId => $gradesForSubject) {
                $cs = $classSubjects[$subjectId] ?? null;
                if ($cs) {
                    $moyennesPeriodiques = [];
                    foreach (['trimestre1', 'trimestre2', 'trimestre3'] as $period) {
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
                    
                    $moyenneAnnuelleMatiere = $this->calculator->calculateMoyenneAnnuelleMatiere($moyennesPeriodiques);
                    $matieres[] = [
                        'moyenne' => $moyenneAnnuelleMatiere,
                        'coefficient' => $cs->coefficient
                    ];
                }
            }

            $moyenneGenerale = $this->calculator->calculateMoyenneGenerale($matieres);
            $moyennesMap[$studentId] = $moyenneGenerale;
            
            $results[$studentId] = [
                'student' => $studentGrades->first()->student,
                'moyenne_generale' => $moyenneGenerale ? round($moyenneGenerale, 2) : null
            ];
        }

        $ranking = $this->calculator->calculateRanking($moyennesMap);

        $finalList = [];
        foreach ($results as $studentId => $data) {
            $data['rank'] = $ranking[$studentId] ?? null;
            $finalList[] = $data;
        }

        // Trier par rang
        usort($finalList, function($a, $b) {
            return ($a['rank'] ?? 999) <=> ($b['rank'] ?? 999);
        });

        return response()->json([
            'status' => 'success',
            'data' => $finalList
        ]);
    }
}
