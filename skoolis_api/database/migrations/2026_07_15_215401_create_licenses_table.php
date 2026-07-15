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
        Schema::create('licenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained()->onDelete('cascade');
            $table->string('license_key')->unique();
            
            // FK to license_issuers table (can be nullable if we want to allow legacy or manually injected keys without issuer, but best practice is required)
            $table->foreignId('issued_by')->constrained('license_issuers');
            
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->enum('type', ['P4R5YO', 'B4SY1C', 'PYL8U5', 'B3T4YO']); // PRO, BASIC, PLUS, BETA
            
            $table->timestamp('valid_until');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('licenses');
    }
};
