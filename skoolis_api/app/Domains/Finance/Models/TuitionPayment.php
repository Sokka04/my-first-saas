<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TuitionPayment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'student_id',
        'school_class_id',
        'paid_amount',
        'payment_date',
        'payment_method',
        'reference',
        'receipt_number'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($payment) {
            if (empty($payment->receipt_number)) {
                $payment->receipt_number = 'REC-ECO-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -4));
            }
        });
    }

    public function student()
    {
        return $this->belongsTo(\App\Domains\Student\Models\Student::class, 'student_id');
    }

    public function schoolClass()
    {
        return $this->belongsTo(\App\Models\SchoolClass::class, 'school_class_id');
    }
}
