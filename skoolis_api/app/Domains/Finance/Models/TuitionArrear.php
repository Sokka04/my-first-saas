<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TuitionArrear extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'student_id',
        'academic_year',
        'original_amount',
        'discount_amount',
        'is_forgiven',
    ];

    public function student()
    {
        return $this->belongsTo(\App\Domains\Student\Models\Student::class, 'student_id');
    }

    public function payments()
    {
        return $this->hasMany(TuitionArrearPayment::class, 'tuition_arrear_id');
    }
}
