<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TuitionInstallment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'school_class_id',
        'installment_number',
        'amount',
        'deadline',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(\App\Models\SchoolClass::class, 'school_class_id');
    }
}
