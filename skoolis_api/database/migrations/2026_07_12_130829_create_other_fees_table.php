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
        Schema::create('other_fees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->enum('type', ['unique', 'journalier', 'periodique', 'occasionnel']);
            $table->foreignUuid('school_class_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('amount_boy', 10, 2);
            $table->decimal('amount_girl', 10, 2);
            $table->date('deadline')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('other_fees');
    }
};
