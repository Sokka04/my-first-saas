<?php

namespace App\Domains\School\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'status',
        'created_by',
        'updated_by',
    ];
}
