<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = ['registration_payments', 'tuition_payments', 'tuition_arrear_payments', 'other_fee_payments'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $tableSchema) {
                $tableSchema->string('receipt_number')->nullable()->unique()->after('id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['registration_payments', 'tuition_payments', 'tuition_arrear_payments', 'other_fee_payments'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $tableSchema) {
                $tableSchema->dropColumn('receipt_number');
            });
        }
    }
};
