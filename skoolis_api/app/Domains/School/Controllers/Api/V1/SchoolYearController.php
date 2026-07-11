<?php

namespace App\Domains\School\Controllers\Api\V1;

use App\Domains\School\Models\SchoolYear;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SchoolYearController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $years = SchoolYear::where('school_id', $schoolId)->orderBy('starts_on', 'desc')->get();

        return response()->json([
            'data' => $years
        ]);
    }
}
