<?php

namespace App\Domains\Subject\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Domains\Subject\Models\Subject;
use App\Domains\Subject\Models\ClassSubject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Liste des matières (scopées par école si nécessaire)
     */
    public function index(Request $request)
    {
        // En supposant que le school_id est géré (ici on prend tout pour simplifier, ou on pourrait filtrer)
        // Normalement on filtrerait par l'école de l'utilisateur connecté.
        $subjects = Subject::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $subjects
        ]);
    }

    /**
     * Enregistrer une nouvelle matière
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'category' => 'nullable|string|in:scientifique,litteraire,technique,art,sport,langue',
            'description' => 'nullable|string'
        ]);

        // Assigner temporairement un school_id mocké (ou à récupérer depuis l'auth)
        $validated['school_id'] = '11111111-1111-1111-1111-111111111111'; // A remplacer par Auth::user()->school_id

        $subject = Subject::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $subject
        ], 201);
    }

    /**
     * Récupérer une matière spécifique
     */
    public function show($id)
    {
        $subject = Subject::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $subject
        ]);
    }

    /**
     * Mettre à jour une matière
     */
    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:50',
            'category' => 'nullable|string|in:scientifique,litteraire,technique,art,sport,langue',
            'description' => 'nullable|string'
        ]);

        $subject->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $subject
        ]);
    }

    /**
     * Supprimer une matière
     */
    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Matière supprimée avec succès'
        ]);
    }

    /**
     * ASSIGNATION : Attribuer une matière à une classe (class_subject)
     */
    public function assignToClass(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|uuid|exists:school_classes,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'coefficient' => 'required|numeric|min:0.5',
            'evaluation_type' => 'required|string|in:composition,examen_pratique',
            'teacher_id' => 'nullable|uuid|exists:teachers,id'
        ]);

        // Créer ou mettre à jour l'assignation
        $classSubject = ClassSubject::updateOrCreate(
            [
                'school_class_id' => $validated['school_class_id'],
                'subject_id' => $validated['subject_id'],
            ],
            [
                'coefficient' => $validated['coefficient'],
                'evaluation_type' => $validated['evaluation_type'],
                'teacher_id' => $validated['teacher_id'],
            ]
        );

        return response()->json([
            'status' => 'success',
            'data' => $classSubject
        ]);
    }

    /**
     * Liste des matières assignées pour une classe
     */
    public function classSubjects($classId)
    {
        $classSubjects = ClassSubject::with(['subject', 'teacher'])
                            ->where('school_class_id', $classId)
                            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $classSubjects
        ]);
    }
}
