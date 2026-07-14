<?php

namespace App\Domains\Finance\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domains\Finance\Models\OtherFee;
use App\Domains\Finance\Models\StudentOtherFee;
use App\Domains\Finance\Models\OtherFeePayment;
use App\Domains\Student\Models\Student;
use Illuminate\Support\Facades\DB;

class OtherFeeController extends Controller
{
    // --- 1. CONFIGURATION DES FRAIS ---
    
    public function index()
    {
        $fees = OtherFee::with('schoolClass')->orderBy('created_at', 'desc')->get();
        return response()->json($fees);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:unique,journalier,periodique,occasionnel',
            'school_class_id' => 'nullable|exists:school_classes,id',
            'amount_boy' => 'required|numeric|min:0',
            'amount_girl' => 'required|numeric|min:0',
            'deadline' => 'nullable|date',
            'description' => 'nullable|string'
        ]);

        $fee = OtherFee::create($validated);
        return response()->json($fee, 201);
    }

    public function destroy(OtherFee $otherFee)
    {
        $otherFee->delete();
        return response()->json(['message' => 'Frais supprimé']);
    }

    // --- 2. ASSIGNATION DES FRAIS ---

    public function assignToStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'other_fee_id' => 'required|exists:other_fees,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:du,partiel,paye,exonere',
            'assignment_date' => 'required|date',
            'remarks' => 'nullable|string'
        ]);

        // Check if already assigned
        $exists = StudentOtherFee::where('student_id', $validated['student_id'])
            ->where('other_fee_id', $validated['other_fee_id'])
            ->exists();
            
        if ($exists) {
            return response()->json(['message' => 'Ce frais est déjà assigné à cet élève'], 400);
        }

        $studentFee = StudentOtherFee::create($validated);
        return response()->json($studentFee, 201);
    }

    public function assignToClass(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'other_fee_id' => 'required|exists:other_fees,id',
            'amount_boy' => 'required|numeric|min:0',
            'amount_girl' => 'required|numeric|min:0',
            'assignment_date' => 'required|date'
        ]);

        $students = Student::where('school_class_id', $validated['school_class_id'])->get();
        $count = 0;

        foreach ($students as $student) {
            $exists = StudentOtherFee::where('student_id', $student->id)
                ->where('other_fee_id', $validated['other_fee_id'])
                ->exists();

            if (!$exists) {
                StudentOtherFee::create([
                    'student_id' => $student->id,
                    'other_fee_id' => $validated['other_fee_id'],
                    'amount' => $student->gender === 'M' ? $validated['amount_boy'] : $validated['amount_girl'],
                    'status' => 'du',
                    'assignment_date' => $validated['assignment_date']
                ]);
                $count++;
            }
        }

        return response()->json(['message' => "$count élèves ont été assignés à ce frais."]);
    }

    // --- 3. PAIEMENTS ---

    public function getStudentDues($studentId)
    {
        $dues = StudentOtherFee::with('otherFee', 'payments')
            ->where('student_id', $studentId)
            ->get();
            
        return response()->json($dues);
    }

    public function storePayment(Request $request)
    {
        $validated = $request->validate([
            'student_other_fee_id' => 'required|exists:student_other_fees,id',
            'paid_amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'nullable|string',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated) {
            $studentFee = StudentOtherFee::findOrFail($validated['student_other_fee_id']);
            
            // Check if amount is valid
            if ($validated['paid_amount'] > $studentFee->reste_a_payer) {
                return response()->json(['message' => 'Le montant dépasse le reste à payer'], 400);
            }

            $payment = OtherFeePayment::create($validated);

            // Update status
            $totalPaid = $studentFee->total_paid + $validated['paid_amount'];
            if ($totalPaid >= $studentFee->amount) {
                $studentFee->update(['status' => 'paye']);
            } else {
                $studentFee->update(['status' => 'partiel']);
            }

            return response()->json($payment, 201);
        });
    }

    // --- 4. ÉTAT FINANCIER ---
    
    public function getStats(Request $request)
    {
        $query = StudentOtherFee::query();

        // Appliquer les filtres
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->has('school_class_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('school_class_id', $request->school_class_id);
            });
        }
        if ($request->has('other_fee_id')) {
            $query->where('other_fee_id', $request->other_fee_id);
        }

        $allFees = $query->get();
        
        $totalAttendu = $allFees->sum('amount');
        $totalPercu = $allFees->sum('total_paid');
        $totalRestant = $totalAttendu - $totalPercu;
        $tauxRecouvrement = $totalAttendu > 0 ? round(($totalPercu / $totalAttendu) * 100, 2) : 0;

        return response()->json([
            'total_attendu' => $totalAttendu,
            'total_percu' => $totalPercu,
            'total_restant' => $totalRestant,
            'taux_recouvrement' => $tauxRecouvrement
        ]);
    }
}
