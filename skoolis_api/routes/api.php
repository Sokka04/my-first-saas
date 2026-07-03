<?php

use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\MeController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('api.v1.health');

    Route::middleware(['auth:sanctum', 'school.team'])->group(function (): void {
        Route::get('/me', MeController::class)->name('api.v1.me');
    });
});
