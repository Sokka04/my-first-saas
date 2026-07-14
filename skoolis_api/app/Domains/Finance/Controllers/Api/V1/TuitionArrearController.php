<?php

namespace App\Domains\Finance\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Domains\Finance\Models\TuitionArrear;
use App\Domains\Finance\Models\TuitionArrearPayment;
use Illuminate\Http\Request;

class TuitionArrearController extends Controller
{
    /**
     * Obtenir la liste des arriérés avec le calcul du reste à payer
     */
    public function getArrears()
    {
        $arrears = TuitionArrear::with(['student', 'payments'])->get();
        
        $data = $arrears->map(function ($arrear) {
            $totalPaid = $arrear->payments->sum('paid_amount');
            $reste = $arrear->is_forgiven ? 0 : ($arrear->original_amount - $arrear->discount_amount - $totalPaid);
            
            return [
                'id' => $arrear->id,
                'student' => $arrear->student,
                'academic_year' => $arrear->academic_year,
                'original_amount' => $arrear->original_amount,
                'discount_amount' => $arrear->discount_amount,
                'is_forgiven' => $arrear->is_forgiven,
                'total_paid' => $totalPaid,
                'reste_a_payer' => max(0, $reste),
                'payments' => $arrear->payments
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * Obtenir les détails pour un étudiant spécifique
     */
    public function getStudentArrear($studentId)
    {
        $arrear = TuitionArrear::with(['student', 'payments'])
            ->where('student_id', $studentId)
            ->first();

        if (!$arrear) {
            return response()->json(['status' => 'error', 'message' => 'Aucun arriéré trouvé'], 404);
        }

        $totalPaid = $arrear->payments->sum('paid_amount');
        $reste = $arrear->is_forgiven ? 0 : ($arrear->original_amount - $arrear->discount_amount - $totalPaid);

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $arrear->id,
                'student' => $arrear->student,
                'academic_year' => $arrear->academic_year,
                'original_amount' => $arrear->original_amount,
                'discount_amount' => $arrear->discount_amount,
                'is_forgiven' => $arrear->is_forgiven,
                'total_paid' => $totalPaid,
                'reste_a_payer' => max(0, $reste),
                'payments' => $arrear->payments
            ]
        ]);
    }

    /**
     * Initialiser un arriéré manuellement
     */
    public function initArrear(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|uuid|exists:students,id',
            'original_amount' => 'required|numeric|min:1',
            'academic_year' => 'nullable|string'
        ]);

        $arrear = TuitionArrear::updateOrCreate(
            ['student_id' => $validated['student_id']],
            [
                'original_amount' => $validated['original_amount'],
                'academic_year' => $validated['academic_year'] ?? 'Initial'
            ]
        );

        return response()->json(['status' => 'success', 'data' => $arrear]);
    }

    /**
     * Appliquer une remise
     */
    public function applyDiscount(Request $request)
    {
        $validated = $request->validate([
            'arrear_id' => 'required|uuid|exists:tuition_arrears,id',
            'discount_amount' => 'required|numeric|min:0'
        ]);

        $arrear = TuitionArrear::findOrFail($validated['arrear_id']);
        $arrear->discount_amount = $validated['discount_amount'];
        $arrear->save();

        return response()->json(['status' => 'success', 'message' => 'Remise appliquée']);
    }

    /**
     * Gracier la dette
     */
    public function forgiveDebt(Request $request)
    {
        $validated = $request->validate([
            'arrear_id' => 'required|uuid|exists:tuition_arrears,id'
        ]);

        $arrear = TuitionArrear::findOrFail($validated['arrear_id']);
        $arrear->is_forgiven = true;
        $arrear->save();

        return response()->json(['status' => 'success', 'message' => 'Dette graciée']);
    }

    /**
     * Enregistrer un paiement d'arriéré
     */
    public function savePayment(Request $request)
    {
        $validated = $request->validate([
            'arrear_id' => 'required|uuid|exists:tuition_arrears,id',
            'paid_amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        $arrear = TuitionArrear::findOrFail($validated['arrear_id']);

        if ($arrear->is_forgiven) {
            return response()->json(['status' => 'error', 'message' => 'Cette dette a été graciée.'], 400);
        }

        $payment = TuitionArrearPayment::create([
            'tuition_arrear_id' => $validated['arrear_id'],
            'paid_amount' => $validated['paid_amount'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'],
            'reference' => $validated['reference'] ?? null,
            'notes' => $validated['notes'] ?? null
        ]);

        return response()->json(['status' => 'success', 'data' => $payment]);
    }
}
