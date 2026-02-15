<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->enum('position', ['main_slider', 'promo_card']);
            $table->tinyInteger('card_slot')->nullable()->comment('1=atas, 2=bawah. Null untuk slider');
            $table->string('title', 100);
            $table->string('subtitle', 100)->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('gradient_from', 50)->default('orange-600');
            $table->string('gradient_to', 50)->default('amber-600');
            $table->boolean('button_enabled')->default(false);
            $table->string('button_text', 50)->nullable();
            $table->enum('button_link_type', ['product', 'category', 'custom_url'])->nullable();
            $table->string('button_link_value')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
