<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TuitionStudentInstallment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'student_id',
        'installment_number',
        'amount',
        'deadline',
    ];

    public function student()
    {
        return $this->belongsTo(\App\Models\Student::class, 'student_id');
    }
}
