<?php

namespace App\Domains\Student\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guardian extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'school_id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'profession',
        'created_by',
        'updated_by',
    ];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'guardian_student')
            ->withPivot('relationship', 'is_primary')
            ->withTimestamps();
    }
}
