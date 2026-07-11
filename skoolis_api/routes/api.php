<?php

use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\MeController;
use App\Domains\Auth\Controllers\Api\V1\AuthController;
use App\Domains\Student\Controllers\Api\V1\StudentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('api.v1.health');

    Route::post('/login', [AuthController::class, 'login'])->name('api.v1.login');

    Route::middleware(['auth:sanctum', 'school.team'])->group(function (): void {
        Route::get('/me', MeController::class)->name('api.v1.me');
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.v1.logout');
        
        Route::apiResource('students', StudentController::class);
    });
});
