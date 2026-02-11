<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel attributes, attribute_values, dan product_attribute_value
     */
    public function up(): void
    {
        // Tabel attributes (contoh: Ukuran, Warna, Bahan)
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // Tanpa timestamps sesuai model
        });

        // Tabel attribute_values (contoh: S, M, L, XL untuk ukuran)
        Schema::create('attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_id')->constrained('attributes')->onDelete('cascade');
            $table->string('value');
            // Tanpa timestamps sesuai model
        });

        // Pivot table: product <-> attribute_value dengan harga tambahan
        Schema::create('product_attribute_value', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id_produk')->constrained(
                table: 'products', column: 'id_produk'
            )->onDelete('cascade');
            $table->foreignId('attribute_value_id')->constrained('attribute_values')->onDelete('cascade');
            $table->decimal('price', 15, 2)->default(0);  // Harga tambahan untuk varian
            // Tanpa timestamps sesuai model
            
            // Unique constraint untuk mencegah duplikat
            $table->unique(['product_id_produk', 'attribute_value_id'], 'product_attr_val_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attribute_value');
        Schema::dropIfExists('attribute_values');
        Schema::dropIfExists('attributes');
    }
};
