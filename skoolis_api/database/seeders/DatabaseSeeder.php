<?php

namespace Database\Seeders;

use App\Domains\Auth\Models\User;
use App\Domains\School\Models\Enrollment;
use App\Domains\School\Models\School;
use App\Domains\School\Models\SchoolClass;
use App\Domains\Student\Models\Student;
use App\Domains\Teacher\Models\Teacher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $schoolId = (string) Str::uuid();
        $schoolYearId = (string) Str::uuid();

        // Create a School
        DB::table('schools')->insert([
            'id' => $schoolId,
            'name' => 'Lycée Français',
            'code' => 'LF01',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a School Year
        DB::table('school_years')->insert([
            'id' => $schoolYearId,
            'school_id' => $schoolId,
            'label' => '2026-2027',
            'starts_on' => '2026-09-01',
            'ends_on' => '2027-06-30',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create Admin User
        User::create([
            'school_id' => $schoolId,
            'name' => 'Admin School',
            'email' => 'admin@school.com',
            'password' => Hash::make('password'),
        ]);

        // Seed Classes
        $classes = SchoolClass::factory()->count(5)->create(['school_id' => $schoolId]);

        // Seed Teachers
        Teacher::factory()->count(10)->create(['school_id' => $schoolId]);

        // Seed Students & Enrollments
        Student::factory()->count(50)->create(['school_id' => $schoolId])->each(function ($student) use ($schoolId, $schoolYearId, $classes) {
            Enrollment::factory()->create([
                'school_id' => $schoolId,
                'student_id' => $student->id,
                'school_class_id' => $classes->random()->id,
                'school_year_id' => $schoolYearId,
            ]);
        });
    }
}
