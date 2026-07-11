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
        $students = Student::where('school_id', $schoolId)->get();

        return response()->json([
            'data' => $students
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
