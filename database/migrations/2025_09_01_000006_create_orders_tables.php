<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel orders dan order_items
     */
    public function up(): void
    {
        // Tabel orders
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            
            // Foreign key ke customers (bukan users)
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            
            // Status pesanan menggunakan enum
            $table->enum('order_status', [
                'pending',
                'processing', 
                'shipped',
                'completed',
                'cancelled'
            ])->default('pending');
            
            // Harga dan biaya
            $table->decimal('total_price', 15, 2);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            
            // Alamat pengiriman (JSON)
            $table->text('shipping_address');
            $table->string('shipping_method')->nullable();
            
            // Pembayaran
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('unpaid');
            $table->string('snap_token')->nullable();
            $table->string('midtrans_order_id')->nullable();
            $table->string('transaction_id')->nullable();
            $table->timestamp('payment_time')->nullable();
            
            // Pengiriman
            $table->string('tracking_number', 100)->nullable();
            
            // Admin
            $table->date('estimated_completion_date')->nullable();
            $table->text('admin_notes')->nullable();
            
            // Timestamps dan soft deletes
            $table->timestamps();
            $table->softDeletes();
        });

        // Tabel order_items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id_produk')->constrained(
                table: 'products', column: 'id_produk'
            )->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 15, 2);  // Harga per item saat checkout
            $table->json('options');  // Snapshot varian, desain, catatan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
