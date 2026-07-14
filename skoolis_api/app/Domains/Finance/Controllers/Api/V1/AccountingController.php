<?php

namespace App\Domains\Finance\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domains\Finance\Models\RegistrationPayment;
use App\Domains\Finance\Models\TuitionPayment;
use App\Domains\Finance\Models\TuitionArrearPayment;
use App\Domains\Finance\Models\OtherFeePayment;
use App\Domains\School\Models\SchoolYear;
use Illuminate\Support\Facades\DB;

class AccountingController extends Controller
{
    /**
     * Bilan Général (Statistiques aggregées par type)
     */
    public function getGeneralBilan(Request $request)
    {
        // 1. Inscriptions
        $regTotal = RegistrationPayment::sum('paid_amount');
        
        // 2. Ecolage
        $tuiTotal = TuitionPayment::sum('paid_amount');
        
        // 3. Arriérés
        $arrTotal = TuitionArrearPayment::sum('paid_amount');
        
        // 4. Autres Frais
        $othTotal = OtherFeePayment::sum('paid_amount');

        $totalGlobal = $regTotal + $tuiTotal + $arrTotal + $othTotal;

        return response()->json([
            'inscriptions' => $regTotal,
            'ecolage' => $tuiTotal,
            'arrieres' => $arrTotal,
            'autres_frais' => $othTotal,
            'total_global' => $totalGlobal
        ]);
    }

    /**
     * Bilan Journalier / Périodique
     */
    public function getDailyBilan(Request $request)
    {
        $startDate = $request->input('start_date', date('Y-m-d'));
        $endDate = $request->input('end_date', date('Y-m-d'));

        $payments = collect([]);

        // Inscriptions
        $regs = RegistrationPayment::with('student')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->get()->map(function($p) {
                return [
                    'id' => $p->id,
                    'receipt_number' => $p->receipt_number,
                    'date' => $p->payment_date,
                    'amount' => $p->paid_amount,
                    'type' => 'Inscription',
                    'student' => $p->student ? $p->student->last_name . ' ' . $p->student->first_name : 'Inconnu',
                    'method' => $p->payment_method
                ];
            });
        $payments = $payments->concat($regs);

        // Ecolage
        $tuis = TuitionPayment::with('student')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->get()->map(function($p) {
                return [
                    'id' => $p->id,
                    'receipt_number' => $p->receipt_number,
                    'date' => $p->payment_date,
                    'amount' => $p->paid_amount,
                    'type' => 'Ecolage',
                    'student' => $p->student ? $p->student->last_name . ' ' . $p->student->first_name : 'Inconnu',
                    'method' => $p->payment_method
                ];
            });
        $payments = $payments->concat($tuis);

        // Arriérés
        $arrs = TuitionArrearPayment::with('tuitionArrear.student')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->get()->map(function($p) {
                $student = $p->tuitionArrear && $p->tuitionArrear->student 
                    ? $p->tuitionArrear->student->last_name . ' ' . $p->tuitionArrear->student->first_name 
                    : 'Inconnu';
                return [
                    'id' => $p->id,
                    'receipt_number' => $p->receipt_number,
                    'date' => $p->payment_date,
                    'amount' => $p->paid_amount,
                    'type' => 'Arriéré',
                    'student' => $student,
                    'method' => $p->payment_method
                ];
            });
        $payments = $payments->concat($arrs);

        // Autres
        $oths = OtherFeePayment::with('studentOtherFee.student')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->get()->map(function($p) {
                $student = $p->studentOtherFee && $p->studentOtherFee->student 
                    ? $p->studentOtherFee->student->last_name . ' ' . $p->studentOtherFee->student->first_name 
                    : 'Inconnu';
                return [
                    'id' => $p->id,
                    'receipt_number' => $p->receipt_number,
                    'date' => $p->payment_date,
                    'amount' => $p->paid_amount,
                    'type' => 'Autres Frais',
                    'student' => $student,
                    'method' => $p->payment_method
                ];
            });
        $payments = $payments->concat($oths);

        // Sort by date desc
        $sorted = $payments->sortByDesc('date')->values();

        return response()->json([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_amount' => $sorted->sum('amount'),
            'payments' => $sorted
        ]);
    }

    /**
     * Authentification de Reçu
     */
    public function verifyReceipt($receiptNumber)
    {
        // Chercher dans Inscriptions
        $reg = RegistrationPayment::with('student')->where('receipt_number', $receiptNumber)->first();
        if ($reg) {
            return response()->json([
                'valid' => true,
                'receipt_number' => $reg->receipt_number,
                'amount' => $reg->paid_amount,
                'date' => $reg->payment_date,
                'type' => 'Inscription',
                'student' => $reg->student ? $reg->student->last_name . ' ' . $reg->student->first_name : 'Inconnu',
                'method' => $reg->payment_method,
                'created_at' => $reg->created_at
            ]);
        }

        // Chercher dans Ecolage
        $tui = TuitionPayment::with('student')->where('receipt_number', $receiptNumber)->first();
        if ($tui) {
            return response()->json([
                'valid' => true,
                'receipt_number' => $tui->receipt_number,
                'amount' => $tui->paid_amount,
                'date' => $tui->payment_date,
                'type' => 'Ecolage',
                'student' => $tui->student ? $tui->student->last_name . ' ' . $tui->student->first_name : 'Inconnu',
                'method' => $tui->payment_method,
                'created_at' => $tui->created_at
            ]);
        }

        // Chercher dans Arriérés
        $arr = TuitionArrearPayment::with('tuitionArrear.student')->where('receipt_number', $receiptNumber)->first();
        if ($arr) {
            $student = $arr->tuitionArrear && $arr->tuitionArrear->student ? $arr->tuitionArrear->student->last_name . ' ' . $arr->tuitionArrear->student->first_name : 'Inconnu';
            return response()->json([
                'valid' => true,
                'receipt_number' => $arr->receipt_number,
                'amount' => $arr->paid_amount,
                'date' => $arr->payment_date,
                'type' => 'Arriéré d\'écolage',
                'student' => $student,
                'method' => $arr->payment_method,
                'created_at' => $arr->created_at
            ]);
        }

        // Chercher dans Autres Frais
        $oth = OtherFeePayment::with('studentOtherFee.student')->where('receipt_number', $receiptNumber)->first();
        if ($oth) {
            $student = $oth->studentOtherFee && $oth->studentOtherFee->student ? $oth->studentOtherFee->student->last_name . ' ' . $oth->studentOtherFee->student->first_name : 'Inconnu';
            return response()->json([
                'valid' => true,
                'receipt_number' => $oth->receipt_number,
                'amount' => $oth->paid_amount,
                'date' => $oth->payment_date,
                'type' => 'Autres Frais',
                'student' => $student,
                'method' => $oth->payment_method,
                'created_at' => $oth->created_at
            ]);
        }

        return response()->json([
            'valid' => false,
            'message' => 'Ce reçu est introuvable ou falsifié.'
        ], 404);
    }
}
