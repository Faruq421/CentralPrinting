<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel products dengan semua kolom final
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            // Primary key dengan nama custom
            $table->id('id_produk');
            
            // Foreign key ke categories
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            
            // Data produk
            $table->string('nama_produk');
            $table->string('slug')->unique()->nullable();
            $table->text('deskripsi');
            $table->decimal('harga', 15, 2);  // Menggunakan decimal untuk akurasi harga
            $table->integer('stok');
            $table->boolean('status')->default(false);  // Status publish
            $table->boolean('is_active')->default(true);  // Status aktif
            $table->boolean('allow_custom_design')->default(false);  // Izinkan desain kustom
            $table->boolean('enable_design_feature')->default(false);  // Aktifkan fitur desain
            $table->string('gambar');
            
            // Timestamps dan soft deletes untuk products
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
