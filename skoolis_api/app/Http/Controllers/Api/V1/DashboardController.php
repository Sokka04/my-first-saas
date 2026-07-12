<?php

namespace App\Http\Controllers\Api\V1;

use App\Domains\Student\Models\Student;
use App\Domains\School\Models\SchoolClass;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(Request $request): JsonResponse
    {
        // Total stats
        $totalStudents = Student::count();
        $totalClasses = SchoolClass::count();
        $totalTeachers = 0; // TODO: replace with Teacher::count() when implemented
        $totalSubjects = 0; // TODO: replace with Subject::count() when implemented

        // Latest 5 enrollments (students)
        $latestStudents = Student::with(['enrollments.schoolClass'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Monthly enrollments for the chart (for the current year)
        // Grouping by month
        $currentYear = date('Y');
        $monthlyEnrollments = Student::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Format for Recharts (e.g. [{name: 'Jan', enrollments: 12}, ...])
        $months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        $chartData = [];
        
        for ($i = 1; $i <= 12; $i++) {
            $chartData[] = [
                'name' => $months[$i - 1],
                'enrollments' => $monthlyEnrollments[$i] ?? 0
            ];
        }

        return response()->json([
            'stats' => [
                'students' => $totalStudents,
                'teachers' => $totalTeachers,
                'classes' => $totalClasses,
                'subjects' => $totalSubjects,
            ],
            'latest_students' => $latestStudents,
            'chart_data' => $chartData
        ]);
    }
}
