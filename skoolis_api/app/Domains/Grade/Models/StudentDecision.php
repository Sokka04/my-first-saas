<?php

namespace App\Domains\Grade\Models;

use App\Domains\School\Models\SchoolYear;
use App\Domains\Student\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentDecision extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id',
        'school_year_id',
        'annual_average',
        'decision',
        'is_manual_override',
        'decided_by',
        'decided_at'
    ];

    protected $casts = [
        'annual_average' => 'float',
        'is_manual_override' => 'boolean',
        'decided_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function decidedBy()
    {
        return $this->belongsTo(User::class, 'decided_by');
    }
}
