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
        Schema::create('grade_thresholds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_class_id')->constrained('school_classes')->cascadeOnDelete();
            $table->foreignUuid('school_year_id')->constrained('school_years')->cascadeOnDelete();
            
            $table->decimal('passing_average', 4, 2)->default(10.00);
            
            $table->timestamps();
            
            $table->unique(['school_class_id', 'school_year_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_thresholds');
    }
};
