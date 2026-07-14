<?php

use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\MeController;
use App\Domains\Auth\Controllers\Api\V1\AuthController;
use App\Domains\Student\Controllers\Api\V1\StudentController;
use App\Domains\School\Controllers\Api\V1\SchoolClassController;
use App\Domains\Teacher\Controllers\Api\V1\TeacherController;
use App\Domains\Grade\Controllers\Api\V1\GradeController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('api.v1.health');

    Route::post('/login', [AuthController::class, 'login'])->name('api.v1.login');

    Route::middleware(['auth:sanctum', 'school.team'])->group(function (): void {
        Route::get('/me', MeController::class)->name('api.v1.me');
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.v1.logout');
        
        Route::get('/dashboard/stats', [\App\Http\Controllers\Api\V1\DashboardController::class, 'stats']);

        Route::apiResource('students', StudentController::class);
        Route::apiResource('school-classes', SchoolClassController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::get('school-years', [\App\Domains\School\Controllers\Api\V1\SchoolYearController::class, 'index']);

        // Grades
    Route::prefix('grades')->group(function () {
        Route::post('bulk', [\App\Domains\Grade\Controllers\Api\V1\GradeController::class, 'bulkStore']);
        Route::get('', [\App\Domains\Grade\Controllers\Api\V1\GradeController::class, 'index']);
        Route::put('{id}', [\App\Domains\Grade\Controllers\Api\V1\GradeController::class, 'update']);
        Route::delete('{id}', [\App\Domains\Grade\Controllers\Api\V1\GradeController::class, 'destroy']);
    });
    
    Route::prefix('students')->group(function () {
        Route::get('{id}/period-average', [\App\Domains\Grade\Controllers\Api\V1\GradeController::class, 'studentPeriodAverage']);
    });
    
    Route::prefix('classes')->group(function () {
        Route::get('{id}/period-averages', [\App\Domains\Grade\Controllers\Api\V1\GradeController::class, 'classPeriodAverages']);
        Route::get('{id}/annual-averages', [\App\Domains\Grade\Controllers\Api\V1\GradeController::class, 'classAnnualAverages']);
        Route::get('{id}/subjects', [\App\Domains\Subject\Controllers\Api\V1\SubjectController::class, 'classSubjects']);
        Route::post('{id}/subjects', [\App\Domains\Subject\Controllers\Api\V1\SubjectController::class, 'assignToClass']);
    });

    // Subjects
    Route::apiResource('subjects', \App\Domains\Subject\Controllers\Api\V1\SubjectController::class);

    // Finance - Inscriptions
    Route::prefix('finance')->group(function () {
        Route::apiResource('fee-configs', \App\Domains\Finance\Controllers\Api\V1\RegistrationFeeConfigController::class)->only(['index', 'store', 'destroy']);
        Route::apiResource('payments', \App\Domains\Finance\Controllers\Api\V1\RegistrationPaymentController::class)->only(['index', 'store']);
        Route::get('payments/student/{studentId}', [\App\Domains\Finance\Controllers\Api\V1\RegistrationPaymentController::class, 'showStudentPayments']);

        // Finance - Ecolage
        Route::get('tuition-configs', [\App\Domains\Finance\Controllers\Api\V1\TuitionController::class, 'getConfigs']);
        Route::post('tuition-configs', [\App\Domains\Finance\Controllers\Api\V1\TuitionController::class, 'saveConfigs']);
        Route::post('tuition-class-installments', [\App\Domains\Finance\Controllers\Api\V1\TuitionController::class, 'saveClassInstallments']);
        Route::post('tuition-student-installments', [\App\Domains\Finance\Controllers\Api\V1\TuitionController::class, 'saveStudentInstallments']);
        Route::get('tuition-student/{studentId}', [\App\Domains\Finance\Controllers\Api\V1\TuitionController::class, 'getStudentEcolage']);
        Route::get('tuition-payments', [\App\Domains\Finance\Controllers\Api\V1\TuitionController::class, 'getPayments']);
        Route::post('tuition-payments', [\App\Domains\Finance\Controllers\Api\V1\TuitionController::class, 'savePayment']);

        // Finance - Arriérés
        Route::get('arrears', [\App\Domains\Finance\Controllers\Api\V1\TuitionArrearController::class, 'getArrears']);
        Route::get('arrears/student/{studentId}', [\App\Domains\Finance\Controllers\Api\V1\TuitionArrearController::class, 'getStudentArrear']);
        Route::post('arrears/init', [\App\Domains\Finance\Controllers\Api\V1\TuitionArrearController::class, 'initArrear']);
        Route::post('arrears/discount', [\App\Domains\Finance\Controllers\Api\V1\TuitionArrearController::class, 'applyDiscount']);
        Route::post('arrears/forgive', [\App\Domains\Finance\Controllers\Api\V1\TuitionArrearController::class, 'forgiveDebt']);
        Route::post('arrears/payments', [\App\Domains\Finance\Controllers\Api\V1\TuitionArrearController::class, 'savePayment']);

        // Other Fees
        Route::get('/other-fees', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'index']);
        Route::post('/other-fees', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'store']);
        Route::delete('/other-fees/{otherFee}', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'destroy']);
        
        Route::post('/other-fees/assign-student', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'assignToStudent']);
        Route::post('/other-fees/assign-class', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'assignToClass']);
        
        Route::get('/other-fees/student/{studentId}/dues', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'getStudentDues']);
        Route::post('/other-fees/payments', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'storePayment']);
        Route::get('/other-fees/stats', [\App\Domains\Finance\Controllers\Api\V1\OtherFeeController::class, 'getStats']);

        // Accounting / Bilan & Receipts
        Route::get('/accounting/bilan-general', [\App\Domains\Finance\Controllers\Api\V1\AccountingController::class, 'getGeneralBilan']);
        Route::get('/accounting/bilan-journalier', [\App\Domains\Finance\Controllers\Api\V1\AccountingController::class, 'getDailyBilan']);
        Route::get('/accounting/receipts/{receiptNumber}', [\App\Domains\Finance\Controllers\Api\V1\AccountingController::class, 'verifyReceipt']);
    });
    });
});
