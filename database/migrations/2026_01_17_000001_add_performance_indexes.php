<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan index pada kolom yang sering digunakan dalam query
     * untuk meningkatkan performa database.
     */
    public function up(): void
    {
        // Index pada tabel products
        Schema::table('products', function (Blueprint $table) {
            // Index gabungan untuk filtering produk aktif
            $table->index(['status', 'is_active'], 'products_status_active_index');
        });

        // Index pada tabel orders
        Schema::table('orders', function (Blueprint $table) {
            $table->index('order_status', 'orders_order_status_index');
            $table->index('payment_status', 'orders_payment_status_index');
            // Index gabungan untuk query pesanan per customer dengan status tertentu
            $table->index(['customer_id', 'order_status'], 'orders_customer_status_index');
            // Index untuk pencarian berdasarkan tanggal
            $table->index('created_at', 'orders_created_at_index');
        });

        // Index pada tabel reviews
        Schema::table('reviews', function (Blueprint $table) {
            // Index gabungan untuk menampilkan review produk yang visible
            $table->index(['product_id', 'is_visible'], 'reviews_product_visible_index');
            $table->index('customer_id', 'reviews_customer_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_status_active_index');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('orders_order_status_index');
            $table->dropIndex('orders_payment_status_index');
            $table->dropIndex('orders_customer_status_index');
            $table->dropIndex('orders_created_at_index');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex('reviews_product_visible_index');
            $table->dropIndex('reviews_customer_id_index');
        });
    }
};
