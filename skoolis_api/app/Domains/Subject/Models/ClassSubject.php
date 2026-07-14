<?php

namespace App\Domains\Subject\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Domains\School\Models\SchoolClass;
use App\Domains\Teacher\Models\Teacher;

class ClassSubject extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'class_subject';

    protected $fillable = [
        'school_class_id',
        'subject_id',
        'teacher_id',
        'coefficient',
        'evaluation_type',
    ];

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
