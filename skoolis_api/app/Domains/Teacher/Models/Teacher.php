<?php

namespace App\Domains\Teacher\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $guarded = [];

    protected static function newFactory()
    {
        return \Database\Factories\TeacherFactory::new();
    }
}
