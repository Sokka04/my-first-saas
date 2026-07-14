<?php

namespace App\Domains\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Domains\Student\Models\Student;

class StudentOtherFee extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id',
        'other_fee_id',
        'amount',
        'status',
        'assignment_date',
        'remarks'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function otherFee()
    {
        return $this->belongsTo(OtherFee::class);
    }

    public function payments()
    {
        return $this->hasMany(OtherFeePayment::class);
    }

    protected $appends = ['total_paid', 'reste_a_payer'];

    public function getTotalPaidAttribute()
    {
        return $this->payments()->sum('paid_amount');
    }

    public function getResteAPayerAttribute()
    {
        return $this->amount - $this->total_paid;
    }
}
