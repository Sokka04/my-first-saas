<?php

namespace App\Domains\Finance\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Domains\Finance\Models\RegistrationPayment;
use App\Models\Student;
use Illuminate\Http\Request;

class RegistrationPaymentController extends Controller
{
    /**
     * Liste des paiements
     */
    public function index(Request $request)
    {
        $payments = RegistrationPayment::with(['student', 'schoolClass'])->orderBy('payment_date', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $payments
        ]);
    }

    /**
     * Enregistrer un paiement
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|uuid|exists:students,id',
            'school_class_id' => 'required|uuid|exists:school_classes,id',
            'expected_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:especes,cheque,virement,mobile',
            'reference' => 'nullable|string'
        ]);

        $validated['school_id'] = '11111111-1111-1111-1111-111111111111'; // Mock Auth::user()->school_id

        // RÈGLE : Vérifier si l'élève a déjà payé AUJOURD'HUI
        $today = now()->toDateString();
        $existingPaymentToday = RegistrationPayment::where('student_id', $validated['student_id'])
            ->whereDate('payment_date', $today)
            ->first();

        if ($existingPaymentToday && !$request->has('force_double_payment')) {
            return response()->json([
                'status' => 'warning',
                'message' => 'Cet élève a déjà effectué un versement aujourd\'hui. Êtes-vous sûr de vouloir enregistrer un nouveau paiement ?'
            ], 409); // Conflict HTTP status
        }

        $payment = RegistrationPayment::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $payment
        ], 201);
    }

    /**
     * Historique d'un étudiant
     */
    public function showStudentPayments($studentId)
    {
        $payments = RegistrationPayment::with(['schoolClass'])
            ->where('student_id', $studentId)
            ->orderBy('payment_date', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $payments
        ]);
    }
}
