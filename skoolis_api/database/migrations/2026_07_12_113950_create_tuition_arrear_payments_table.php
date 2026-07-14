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
        Schema::create('tuition_arrear_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tuition_arrear_id')->constrained()->cascadeOnDelete();
            $table->decimal('paid_amount', 10, 2);
            $table->date('payment_date');
            $table->string('payment_method')->default('especes');
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tuition_arrear_payments');
    }
};
