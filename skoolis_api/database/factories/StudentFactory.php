<?php

namespace Database\Factories;

use App\Domains\Student\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'birth_date' => $this->faker->date('Y-m-d', '-10 years'),
            'gender' => $this->faker->randomElement(['M', 'F']),
            'registration_number' => $this->faker->unique()->numerify('MAT-####'),
        ];
    }
}
