<?php

namespace App\Domains\Student\Controllers\Api\V1;

use App\Domains\Student\Models\Student;
use App\Domains\Student\Requests\StoreStudentRequest;
use App\Domains\Student\Requests\UpdateStudentRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $schoolId = auth()->user()->school_id;
        $students = Student::with(['enrollments.schoolClass'])->where('school_id', $schoolId)->get();

        return response()->json([
            'data' => $students
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $schoolId = auth()->user()->school_id;
        $validated = $request->validated();
        
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = \Illuminate\Support\Str::random(40) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('students', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        $validated['school_id'] = $schoolId;
        $validated['created_by'] = auth()->id();

        // Création de l'élève
        $student = Student::create(\Illuminate\Support\Arr::except($validated, [
            'tuteur_nom', 'tuteur_prenoms', 'tuteur_contact', 'tuteur_profession', 'tuteur_email', 'school_class_id'
        ]));

        // Gestion du Tuteur Principal (si renseigné)
        if (!empty($validated['tuteur_nom']) || !empty($validated['tuteur_prenoms'])) {
            $guardian = \App\Domains\Student\Models\Guardian::create([
                'school_id' => $schoolId,
                'first_name' => $validated['tuteur_prenoms'] ?? '-',
                'last_name' => $validated['tuteur_nom'] ?? '-',
                'phone' => $validated['tuteur_contact'] ?? null,
                'profession' => $validated['tuteur_profession'] ?? null,
                'email' => $validated['tuteur_email'] ?? null,
                'created_by' => auth()->id()
            ]);

            $student->guardians()->attach($guardian->id, [
                'relationship' => 'Tuteur',
                'is_primary' => true
            ]);
        }

        // Gestion de l'Inscription (Enrollment)
        $activeSchoolYear = \App\Domains\School\Models\SchoolYear::where('school_id', $schoolId)
            ->where('status', 'active')
            ->first();

        // Fallback si pas de status 'active', on prend la plus récente
        if (!$activeSchoolYear) {
            $activeSchoolYear = \App\Domains\School\Models\SchoolYear::where('school_id', $schoolId)
                ->orderBy('starts_on', 'desc')
                ->first();
        }

        if ($activeSchoolYear && !empty($validated['school_class_id'])) {
            \App\Domains\School\Models\Enrollment::create([
                'school_id' => $schoolId,
                'student_id' => $student->id,
                'school_class_id' => $validated['school_class_id'],
                'school_year_id' => $activeSchoolYear->id,
                'created_by' => auth()->id()
            ]);
        }

        return response()->json([
            'message' => 'Élève créé avec succès',
            'data' => $student
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $schoolId = auth()->user()->school_id;
        $student = Student::with(['guardians', 'enrollments'])->where('school_id', $schoolId)->findOrFail($id);

        return response()->json([
            'data' => $student
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, string $id): JsonResponse
    {
        $schoolId = auth()->user()->school_id;
        $student = Student::with('guardians')->where('school_id', $schoolId)->findOrFail($id);
        
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            if ($student->photo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($student->photo_path);
            }
            $file = $request->file('photo');
            $filename = \Illuminate\Support\Str::random(40) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('students', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        $validated['updated_by'] = auth()->id();

        $student->update(\Illuminate\Support\Arr::except($validated, [
            'tuteur_nom', 'tuteur_prenoms', 'tuteur_contact', 'tuteur_profession', 'tuteur_email', 'school_class_id', 'school_year_id'
        ]));

        // Update Guardian
        if (isset($validated['tuteur_nom']) || isset($validated['tuteur_prenoms'])) {
            $guardian = $student->guardians()->wherePivot('is_primary', true)->first();
            
            if ($guardian) {
                $guardian->update([
                    'first_name' => $validated['tuteur_prenoms'] ?? $guardian->first_name,
                    'last_name' => $validated['tuteur_nom'] ?? $guardian->last_name,
                    'phone' => $validated['tuteur_contact'] ?? $guardian->phone,
                    'profession' => $validated['tuteur_profession'] ?? $guardian->profession,
                    'email' => $validated['tuteur_email'] ?? $guardian->email,
                    'updated_by' => auth()->id()
                ]);
            } else if (!empty($validated['tuteur_nom']) || !empty($validated['tuteur_prenoms'])) {
                $newGuardian = \App\Domains\Student\Models\Guardian::create([
                    'school_id' => $schoolId,
                    'first_name' => $validated['tuteur_prenoms'] ?? '-',
                    'last_name' => $validated['tuteur_nom'] ?? '-',
                    'phone' => $validated['tuteur_contact'] ?? null,
                    'profession' => $validated['tuteur_profession'] ?? null,
                    'email' => $validated['tuteur_email'] ?? null,
                    'created_by' => auth()->id()
                ]);

                $student->guardians()->attach($newGuardian->id, [
                    'relationship' => 'Tuteur',
                    'is_primary' => true
                ]);
            }
        }

        // Update Enrollment
        if (!empty($validated['school_class_id'])) {
            $schoolYearId = $validated['school_year_id'] ?? null;
            
            if (!$schoolYearId) {
                $activeSchoolYear = \App\Domains\School\Models\SchoolYear::where('school_id', $schoolId)
                    ->where('status', 'active')
                    ->first();
                if (!$activeSchoolYear) {
                    $activeSchoolYear = \App\Domains\School\Models\SchoolYear::where('school_id', $schoolId)->orderBy('starts_on', 'desc')->first();
                }
                $schoolYearId = $activeSchoolYear ? $activeSchoolYear->id : null;
            }

            if ($schoolYearId) {
                $enrollment = \App\Domains\School\Models\Enrollment::where('student_id', $student->id)
                    ->where('school_year_id', $schoolYearId)
                    ->first();

                if ($enrollment) {
                    $enrollment->update([
                        'school_class_id' => $validated['school_class_id'],
                        'updated_by' => auth()->id()
                    ]);
                } else {
                    \App\Domains\School\Models\Enrollment::create([
                        'school_id' => $schoolId,
                        'student_id' => $student->id,
                        'school_class_id' => $validated['school_class_id'],
                        'school_year_id' => $schoolYearId,
                        'created_by' => auth()->id()
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Élève mis à jour avec succès',
            'data' => $student->load('guardians', 'enrollments')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $schoolId = auth()->user()->school_id;
        $student = Student::where('school_id', $schoolId)->findOrFail($id);
        
        if ($student->photo_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($student->photo_path);
        }
        
        $student->delete();

        return response()->json([
            'message' => 'Élève supprimé avec succès'
        ]);
    }
}
