<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TuitionArrearPayment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'tuition_arrear_id',
        'paid_amount',
        'payment_date',
        'payment_method',
        'reference',
        'notes',
        'receipt_number'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($payment) {
            if (empty($payment->receipt_number)) {
                $payment->receipt_number = 'REC-ARR-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -4));
            }
        });
    }

    public function tuitionArrear()
    {
        return $this->belongsTo(TuitionArrear::class, 'tuition_arrear_id');
    }
}
