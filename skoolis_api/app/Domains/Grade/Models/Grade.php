<?php

namespace App\Domains\Grade\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Domains\Student\Models\Student;
use App\Domains\School\Models\SchoolClass;
use App\Domains\Subject\Models\Subject;
use App\Domains\Teacher\Models\Teacher;

class Grade extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id',
        'school_class_id',
        'subject_id',
        'teacher_id',
        'period',
        'interrogation',
        'devoir',
        'composition',
        'examen_pratique',
        'appreciation',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
