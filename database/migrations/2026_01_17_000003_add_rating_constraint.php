<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan CHECK constraint pada kolom rating di tabel reviews
     * untuk memastikan nilai selalu antara 1-5.
     */
    public function up(): void
    {
        // Normalize data yang ada - pastikan rating antara 1-5
        DB::table('reviews')
            ->where('rating', '<', 1)
            ->update(['rating' => 1]);

        DB::table('reviews')
            ->where('rating', '>', 5)
            ->update(['rating' => 5]);

        // Ubah kolom menjadi TINYINT UNSIGNED dan tambah constraint
        // MySQL 8.0+ mendukung CHECK constraint
        DB::statement('ALTER TABLE reviews MODIFY COLUMN rating TINYINT UNSIGNED NOT NULL');
        
        // Tambahkan CHECK constraint
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Hapus constraint
        DB::statement('ALTER TABLE reviews DROP CONSTRAINT reviews_rating_check');
        
        // Kembalikan ke INTEGER
        DB::statement('ALTER TABLE reviews MODIFY COLUMN rating INT UNSIGNED NOT NULL');
    }
};
