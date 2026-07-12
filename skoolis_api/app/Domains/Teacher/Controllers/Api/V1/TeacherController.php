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

        $teachers = Teacher::where('school_id', $schoolId)->get();

        return response()->json([
            'data' => $teachers
        ]);
    }
}
