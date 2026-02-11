<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel stores untuk lokasi toko
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->text('address');
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->string('hours_weekday')->nullable()->comment('Mon-Fri hours');
            $table->string('hours_saturday')->nullable();
            $table->string('hours_sunday')->nullable();
            $table->json('operating_hours')->nullable();  // Format jam operasional fleksibel
            $table->string('google_maps_url')->nullable();
            $table->boolean('is_active')->default(true);
            // Tanpa timestamps sesuai model
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
