<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Mengubah order_status dan payment_status dari string menjadi ENUM
     * untuk validasi data yang lebih ketat.
     */
    public function up(): void
    {
        // Definisi nilai ENUM
        $orderStatuses = ['pending', 'confirmed', 'processing', 'printing', 'ready', 'shipped', 'delivered', 'completed', 'cancelled'];
        $paymentStatuses = ['unpaid', 'pending', 'paid', 'failed', 'refunded', 'expired'];

        // Normalize existing data sebelum konversi
        // Pastikan semua nilai yang ada valid
        DB::table('orders')
            ->whereNotIn('order_status', $orderStatuses)
            ->update(['order_status' => 'pending']);

        DB::table('orders')
            ->whereNotIn('payment_status', $paymentStatuses)
            ->update(['payment_status' => 'unpaid']);

        // Ubah order_status ke ENUM
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status ENUM('pending', 'confirmed', 'processing', 'printing', 'ready', 'shipped', 'delivered', 'completed', 'cancelled') DEFAULT 'pending'");

        // Ubah payment_status ke ENUM
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('unpaid', 'pending', 'paid', 'failed', 'refunded', 'expired') DEFAULT 'unpaid'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kembalikan ke VARCHAR
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status VARCHAR(255) DEFAULT 'pending'");
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status VARCHAR(255) DEFAULT 'unpaid'");
    }
};
