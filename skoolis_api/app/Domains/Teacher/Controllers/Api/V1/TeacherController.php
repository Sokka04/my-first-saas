<?php

namespace App\Domains\Teacher\Controllers\Api\V1;

use App\Domains\Teacher\Models\Teacher;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        $teachers = Teacher::where('school_id', $schoolId)->latest()->get();

        return response()->json([
            'data' => $teachers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|max:255',
            'education_level' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:255|unique:teachers,registration_number',
            'status' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'primary_subject' => 'nullable|string|max:255',
            'secondary_subject' => 'nullable|string|max:255',
            'tertiary_subject' => 'nullable|string|max:255',
        ]);

        $validated['school_id'] = auth()->user()->school_id;
        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        if (empty($validated['registration_number'])) {
            $validated['registration_number'] = 'PROF-' . date('Ymd') . '-' . rand(1000, 9999);
        }

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('teachers/photos', 'public');
            $validated['photo'] = $path;
        }

        $teacher = Teacher::create($validated);

        return response()->json(['data' => $teacher, 'message' => 'Professeur créé avec succès'], 201);
    }

    public function update(Request $request, Teacher $teacher)
    {
        // Ensure user can only update their school's teachers
        if ($teacher->school_id !== auth()->user()->school_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|max:255',
            'education_level' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:255|unique:teachers,registration_number,' . $teacher->id,
            'status' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'primary_subject' => 'nullable|string|max:255',
            'secondary_subject' => 'nullable|string|max:255',
            'tertiary_subject' => 'nullable|string|max:255',
        ]);

        $validated['updated_by'] = auth()->id();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('teachers/photos', 'public');
            $validated['photo'] = $path;
        }

        $teacher->update($validated);

        return response()->json(['data' => $teacher, 'message' => 'Professeur mis à jour avec succès']);
    }

    public function destroy(Teacher $teacher)
    {
        if ($teacher->school_id !== auth()->user()->school_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $teacher->delete();

        return response()->json(['message' => 'Professeur supprimé avec succès']);
    }
}
