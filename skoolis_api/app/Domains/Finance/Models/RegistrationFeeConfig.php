<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RegistrationFeeConfig extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'school_id',
        'school_class_id',
        'amount_boy',
        'amount_girl',
        'application_date'
    ];

    public function schoolClass()
    {
        return $this->belongsTo(\App\Models\SchoolClass::class, 'school_class_id');
    }
}
