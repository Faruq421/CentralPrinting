<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel design_templates dan product_design_template
     */
    public function up(): void
    {
        // Tabel design_templates
        Schema::create('design_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('thumbnail_path')->nullable();
            $table->string('file_path')->nullable();
            // Tanpa timestamps sesuai model
        });

        // Pivot table: product <-> design_template
        Schema::create('product_design_template', function (Blueprint $table) {
            $table->foreignId('product_id_produk')->constrained(
                table: 'products', column: 'id_produk'
            )->onDelete('cascade');
            $table->foreignId('design_template_id')->constrained('design_templates')->onDelete('cascade');
            
            // Primary key gabungan
            $table->primary(['product_id_produk', 'design_template_id'], 'product_design_pk');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_design_template');
        Schema::dropIfExists('design_templates');
    }
};
