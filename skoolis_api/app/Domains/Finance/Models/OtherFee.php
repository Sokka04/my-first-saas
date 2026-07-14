<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Domains\School\Models\SchoolClass;

class OtherFee extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'type',
        'school_class_id',
        'amount_boy',
        'amount_girl',
        'deadline',
        'description'
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }
}
