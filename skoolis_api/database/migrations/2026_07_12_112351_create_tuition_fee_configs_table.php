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
        Schema::create('tuition_fee_configs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_class_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount_boy', 10, 2)->default(0);
            $table->decimal('amount_girl', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['school_class_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tuition_fee_configs');
    }
};
