<?php

namespace App\Domains\Teacher\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'school_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'gender',
        'birth_date',
        'birth_place',
        'address',
        'nationality',
        'marital_status',
        'education_level',
        'photo',
        'registration_number',
        'status',
        'hire_date',
        'primary_subject',
        'secondary_subject',
        'tertiary_subject',
        'created_by',
        'updated_by',
    ];

    protected static function newFactory()
    {
        return \Database\Factories\TeacherFactory::new();
    }
}
