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

        $classes = SchoolClass::where('school_id', $schoolId)->get();

        return response()->json([
            'data' => $classes
        ]);
    }
}
