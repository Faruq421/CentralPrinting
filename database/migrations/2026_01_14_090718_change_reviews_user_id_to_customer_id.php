<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Mengubah reviews.user_id menjadi reviews.customer_id
     * untuk memastikan hanya customer yang bisa membuat review.
     */
    public function up(): void
    {
        // Step 1: Tambah kolom customer_id jika belum ada
        if (!Schema::hasColumn('reviews', 'customer_id')) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->unsignedBigInteger('customer_id')->nullable()->after('id');
            });
        }

        // Step 2: Migrasi data - konversi user_id ke customer_id (jika user_id masih ada)
        if (Schema::hasColumn('reviews', 'user_id')) {
            DB::statement('
                UPDATE reviews r
                SET r.customer_id = (
                    SELECT c.id FROM customers c WHERE c.user_id = r.user_id LIMIT 1
                )
                WHERE r.user_id IS NOT NULL AND r.customer_id IS NULL
            ');

            // Step 3: Drop foreign key constraint first (if exists), then drop the column
            Schema::table('reviews', function (Blueprint $table) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // Foreign key might not exist
                }
            });
            
            Schema::table('reviews', function (Blueprint $table) {
                $table->dropColumn('user_id');
            });
        }
        
        // Step 4: Add foreign key for customer_id if not exists
        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'reviews' 
            AND COLUMN_NAME = 'customer_id' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
        ");
        
        if (empty($foreignKeys)) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'customer_id')) {
                try {
                    $table->dropForeign(['customer_id']);
                } catch (\Exception $e) {}
            }
            if (!Schema::hasColumn('reviews', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
        });

        if (Schema::hasColumn('reviews', 'customer_id') && Schema::hasColumn('reviews', 'user_id')) {
            DB::statement('
                UPDATE reviews r
                SET r.user_id = (
                    SELECT c.user_id FROM customers c WHERE c.id = r.customer_id LIMIT 1
                )
                WHERE r.customer_id IS NOT NULL AND r.user_id IS NULL
            ');
        }

        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'user_id')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
            if (Schema::hasColumn('reviews', 'customer_id')) {
                $table->dropColumn('customer_id');
            }
        });
    }
};
