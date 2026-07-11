<?php

namespace Database\Factories;

use App\Domains\School\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolClassFactory extends Factory
{
    protected $model = SchoolClass::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']) . ' ' . $this->faker->randomElement(['A', 'B', 'C']),
            'capacity' => 30,
            'level' => 'Primary',
        ];
    }
}
