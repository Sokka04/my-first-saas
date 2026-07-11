<?php

namespace Database\Factories;

use App\Domains\School\Models\Enrollment;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition(): array
    {
        return [
            'status' => 'active',
        ];
    }
}
