<?php

namespace App\Domains\Subject\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'school_id',
        'name',
        'code',
        'category',
        'description'
    ];
}
