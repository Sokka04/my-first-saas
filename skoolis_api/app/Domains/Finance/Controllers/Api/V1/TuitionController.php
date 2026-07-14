<?php

namespace App\Domains\Finance\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Domains\Finance\Models\TuitionFeeConfig;
use App\Domains\Finance\Models\TuitionInstallment;
use App\Domains\Finance\Models\TuitionStudentInstallment;
use App\Domains\Finance\Models\TuitionPayment;
use Illuminate\Http\Request;

class TuitionController extends Controller
{
    /**
     * Obtenir la configuration des tarifs d'écolage
     */
    public function getConfigs()
    {
        $configs = TuitionFeeConfig::with('schoolClass')->get();
        $installments = TuitionInstallment::orderBy('installment_number')->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'configs' => $configs,
                'installments' => $installments
            ]
        ]);
    }

    /**
     * Enregistrer la configuration globale (montants de base)
     */
    public function saveConfigs(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|uuid|exists:school_classes,id',
            'amount_boy' => 'required|numeric|min:0',
            'amount_girl' => 'required|numeric|min:0',
        ]);

        $config = TuitionFeeConfig::updateOrCreate(
            ['school_class_id' => $validated['school_class_id']],
            [
                'amount_boy' => $validated['amount_boy'],
                'amount_girl' => $validated['amount_girl']
            ]
        );

        return response()->json([
            'status' => 'success',
            'data' => $config
        ]);
    }

    /**
     * Enregistrer les tranches pour une classe
     */
    public function saveClassInstallments(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|uuid|exists:school_classes,id',
            'installments' => 'required|array',
            'installments.*.installment_number' => 'required|integer|min:1',
            'installments.*.amount' => 'required|numeric|min:0',
            'installments.*.deadline' => 'nullable|date'
        ]);

        TuitionInstallment::where('school_class_id', $validated['school_class_id'])->delete();

        foreach ($validated['installments'] as $inst) {
            TuitionInstallment::create([
                'school_class_id' => $validated['school_class_id'],
                'installment_number' => $inst['installment_number'],
                'amount' => $inst['amount'],
                'deadline' => $inst['deadline'] ?? null
            ]);
        }

        return response()->json(['status' => 'success', 'message' => 'Tranches enregistrées']);
    }

    /**
     * Obtenir les informations d'écolage d'un élève spécifique (Tranches et paiements)
     */
    public function getStudentEcolage($studentId)
    {
        // 1. Récupérer l'élève
        $student = \App\Models\Student::with('currentEnrollment.schoolClass')->findOrFail($studentId);
        $classId = $student->currentEnrollment->school_class_id;

        // 2. Vérifier s'il a une surcharge de tranches
        $studentInstallments = TuitionStudentInstallment::where('student_id', $studentId)
            ->orderBy('installment_number')
            ->get();

        if ($studentInstallments->isEmpty()) {
            // Sinon, utiliser les tranches de la classe
            $installments = TuitionInstallment::where('school_class_id', $classId)
                ->orderBy('installment_number')
                ->get();
        } else {
            $installments = $studentInstallments;
        }

        // 3. Calculer ce qui a été payé
        $totalPaid = TuitionPayment::where('student_id', $studentId)->sum('paid_amount');
        
        $payments = TuitionPayment::where('student_id', $studentId)
            ->orderBy('payment_date', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'installments' => $installments,
                'total_paid' => $totalPaid,
                'payments' => $payments
            ]
        ]);
    }

    /**
     * Surcharger les tranches d'un élève (Remise / Cas Social)
     */
    public function saveStudentInstallments(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|uuid|exists:students,id',
            'installments' => 'required|array',
            'installments.*.installment_number' => 'required|integer|min:1',
            'installments.*.amount' => 'required|numeric|min:0',
            'installments.*.deadline' => 'nullable|date'
        ]);

        TuitionStudentInstallment::where('student_id', $validated['student_id'])->delete();

        foreach ($validated['installments'] as $inst) {
            TuitionStudentInstallment::create([
                'student_id' => $validated['student_id'],
                'installment_number' => $inst['installment_number'],
                'amount' => $inst['amount'],
                'deadline' => $inst['deadline'] ?? null
            ]);
        }

        return response()->json(['status' => 'success', 'message' => 'Tranches personnalisées enregistrées']);
    }

    /**
     * Enregistrer un paiement d'écolage
     */
    public function savePayment(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|uuid|exists:students,id',
            'school_class_id' => 'required|uuid|exists:school_classes,id',
            'paid_amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:especes,cheque,virement,mobile',
            'reference' => 'nullable|string'
        ]);

        $payment = TuitionPayment::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $payment
        ], 201);
    }

    /**
     * Liste des paiements pour les états
     */
    public function getPayments(Request $request)
    {
        $payments = TuitionPayment::with(['student', 'schoolClass'])
            ->orderBy('payment_date', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $payments
        ]);
    }
}
