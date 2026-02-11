<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan indexes untuk performa query
     */
    public function up(): void
    {
        // Index untuk products
        Schema::table('products', function (Blueprint $table) {
            $table->index('status');
            $table->index('is_active');
            $table->index(['status', 'is_active']);
        });

        // Index untuk orders
        Schema::table('orders', function (Blueprint $table) {
            $table->index('order_status');
            $table->index('payment_status');
            $table->index(['order_status', 'payment_status']);
            $table->index('created_at');
        });

        // Index untuk reviews
        Schema::table('reviews', function (Blueprint $table) {
            $table->index('rating');
            $table->index('is_visible');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['status', 'is_active']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['order_status']);
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['order_status', 'payment_status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['rating']);
            $table->dropIndex(['is_visible']);
        });
    }
};
