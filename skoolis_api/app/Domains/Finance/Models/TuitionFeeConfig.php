<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TuitionFeeConfig extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'school_class_id',
        'amount_boy',
        'amount_girl',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(\App\Models\SchoolClass::class, 'school_class_id');
    }
}
