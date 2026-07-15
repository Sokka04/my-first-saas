<?php

namespace App\Domains\Grade\Models;

use App\Domains\School\Models\SchoolClass;
use App\Domains\School\Models\SchoolYear;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeThreshold extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_class_id',
        'school_year_id',
        'passing_average'
    ];

    protected $casts = [
        'passing_average' => 'float',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }
}
