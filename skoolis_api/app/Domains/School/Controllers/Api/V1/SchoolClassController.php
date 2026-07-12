<?php

namespace App\Domains\School\Controllers\Api\V1;

use App\Domains\School\Models\SchoolClass;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $classes = SchoolClass::with('teacher')
            ->withCount('enrollments as students_count') // get student count
            ->where('school_id', $schoolId)
            ->get();

        return response()->json([
            'data' => $classes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'level' => 'nullable|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id'
        ]);

        $validated['school_id'] = auth()->user()->school_id;
        $validated['created_by'] = auth()->id();

        $schoolClass = SchoolClass::create($validated);

        return response()->json([
            'message' => 'Classe créée avec succès',
            'data' => $schoolClass
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $schoolClass = SchoolClass::where('school_id', auth()->user()->school_id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'level' => 'nullable|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id'
        ]);

        $validated['updated_by'] = auth()->id();

        $schoolClass->update($validated);

        return response()->json([
            'message' => 'Classe mise à jour avec succès',
            'data' => $schoolClass
        ]);
    }

    public function destroy(string $id)
    {
        $schoolClass = SchoolClass::where('school_id', auth()->user()->school_id)->findOrFail($id);

        // Cascading soft delete for students enrolled in this class
        $enrollments = $schoolClass->enrollments()->with('student')->get();
        foreach ($enrollments as $enrollment) {
            if ($enrollment->student) {
                // Soft delete the student (which keeps data safe for super admins)
                $enrollment->student->delete();
            }
            $enrollment->delete();
        }

        $schoolClass->delete();

        return response()->json([
            'message' => 'Classe et élèves associés supprimés avec succès'
        ]);
    }
}
