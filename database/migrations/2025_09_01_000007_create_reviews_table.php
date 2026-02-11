<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel reviews
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys - reviews sekarang terhubung ke customers
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products', 'id_produk')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            
            // Data review
            $table->unsignedTinyInteger('rating');  // 1-5 stars
            $table->text('comment')->nullable();
            $table->json('photos')->nullable();
            
            // Flags
            $table->boolean('is_visible')->default(true);  // Untuk moderasi
            $table->boolean('is_edited')->default(false);  // Sudah diedit
            
            // Timestamps
            $table->timestamps();
            
            // Constraint: rating harus 1-5
            // Note: Ini akan dijalankan via raw SQL jika database support
        });
        
        // Tambahkan constraint untuk rating
        if (config('database.default') === 'mysql') {
            \DB::statement('ALTER TABLE reviews ADD CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
