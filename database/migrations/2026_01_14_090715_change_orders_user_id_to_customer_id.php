<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Mengubah orders.user_id menjadi orders.customer_id
     * untuk memastikan hanya customer yang bisa membuat order.
     */
    public function up(): void
    {
        // Step 1: Tambah kolom customer_id jika belum ada
        if (!Schema::hasColumn('orders', 'customer_id')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->unsignedBigInteger('customer_id')->nullable()->after('id');
            });
        }

        // Step 2: Migrasi data - konversi user_id ke customer_id (jika user_id masih ada)
        if (Schema::hasColumn('orders', 'user_id')) {
            DB::statement('
                UPDATE orders o
                SET o.customer_id = (
                    SELECT c.id FROM customers c WHERE c.user_id = o.user_id LIMIT 1
                )
                WHERE o.user_id IS NOT NULL AND o.customer_id IS NULL
            ');

            // Step 3: Drop foreign key constraint first, then drop the column
            Schema::table('orders', function (Blueprint $table) {
                // Drop the foreign key constraint
                $table->dropForeign(['user_id']);
            });
            
            Schema::table('orders', function (Blueprint $table) {
                // Now drop the column
                $table->dropColumn('user_id');
            });
        }
        
        // Step 4: Add foreign key for customer_id if not exists
        // Check if foreign key exists first
        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'orders' 
            AND COLUMN_NAME = 'customer_id' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
        ");
        
        if (empty($foreignKeys)) {
            Schema::table('orders', function (Blueprint $table) {
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback: kembalikan ke user_id
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'customer_id')) {
                try {
                    $table->dropForeign(['customer_id']);
                } catch (\Exception $e) {}
            }
            if (!Schema::hasColumn('orders', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
        });

        // Konversi balik customer_id ke user_id
        if (Schema::hasColumn('orders', 'customer_id') && Schema::hasColumn('orders', 'user_id')) {
            DB::statement('
                UPDATE orders o
                SET o.user_id = (
                    SELECT c.user_id FROM customers c WHERE c.id = o.customer_id LIMIT 1
                )
                WHERE o.customer_id IS NOT NULL AND o.user_id IS NULL
            ');
        }

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'user_id')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
            if (Schema::hasColumn('orders', 'customer_id')) {
                $table->dropColumn('customer_id');
            }
        });
    }
};
