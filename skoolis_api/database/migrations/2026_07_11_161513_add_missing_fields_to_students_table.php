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
        Schema::table('students', function (Blueprint $table) {
            $table->enum('status', ['nouveau', 'redoublant', 'triplant'])->nullable()->after('gender');
            $table->string('birth_place')->nullable()->after('birth_date');
            $table->text('address')->nullable()->after('birth_place');
            $table->date('enrollment_date')->nullable()->after('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['status', 'birth_place', 'address', 'enrollment_date']);
        });
    }
};
