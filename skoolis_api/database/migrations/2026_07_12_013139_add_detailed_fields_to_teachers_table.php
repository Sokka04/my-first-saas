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
        Schema::table('teachers', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('last_name');
            $table->date('birth_date')->nullable()->after('gender');
            $table->string('birth_place')->nullable()->after('birth_date');
            $table->text('address')->nullable()->after('birth_place');
            $table->string('nationality')->nullable()->after('address');
            $table->string('marital_status')->nullable()->after('nationality');
            $table->string('education_level')->nullable()->after('marital_status');
            $table->string('photo')->nullable()->after('education_level');
            $table->string('registration_number')->nullable()->after('id')->unique();
            $table->string('status')->nullable()->after('phone');
            $table->date('hire_date')->nullable()->after('status');
            $table->string('primary_subject')->nullable()->after('hire_date');
            $table->string('secondary_subject')->nullable()->after('primary_subject');
            $table->string('tertiary_subject')->nullable()->after('secondary_subject');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn([
                'gender', 'birth_date', 'birth_place', 'address', 'nationality', 
                'marital_status', 'education_level', 'photo', 'registration_number', 
                'status', 'hire_date', 'primary_subject', 'secondary_subject', 'tertiary_subject'
            ]);
        });
    }
};
