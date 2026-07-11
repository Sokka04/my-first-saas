<?php

namespace App\Domains\Student\Models;

use App\Domains\School\Models\Enrollment;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'school_id',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'registration_number',
        'photo_path',
        'status',
        'birth_place',
        'address',
        'enrollment_date',
        'created_by',
        'updated_by',
    ];

    protected static function newFactory()
    {
        return \App\Domains\Student\Database\Factories\StudentFactory::new();
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'guardian_student')
            ->withPivot('relationship', 'is_primary')
            ->withTimestamps();
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}
