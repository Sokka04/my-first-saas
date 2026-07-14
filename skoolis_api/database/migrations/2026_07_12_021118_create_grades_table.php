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
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignUuid('school_class_id')->constrained('school_classes')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignUuid('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            
            $table->enum('period', ['trimestre1', 'trimestre2', 'trimestre3', 'semestre1', 'semestre2']);
            
            $table->decimal('interrogation', 5, 2)->nullable();
            $table->decimal('devoir', 5, 2)->nullable();
            $table->decimal('composition', 5, 2)->nullable();
            $table->decimal('examen_pratique', 5, 2)->nullable();
            
            $table->string('appreciation')->nullable();
            
            $table->timestamps();
            
            // Un élève ne peut avoir qu'une seule note pour une matière donnée dans une période donnée
            $table->unique(['student_id', 'subject_id', 'period']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
