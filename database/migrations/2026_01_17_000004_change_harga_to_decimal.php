<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Mengubah tipe data kolom harga dari INTEGER ke DECIMAL(15,2)
     * untuk presisi yang lebih baik pada nilai mata uang.
     */
    public function up(): void
    {
        // Ubah kolom harga di tabel products menggunakan raw SQL
        // karena Laravel 12 tidak menyertakan Doctrine DBAL by default
        DB::statement('ALTER TABLE products MODIFY COLUMN harga DECIMAL(15,2) DEFAULT 0');

        // Ubah kolom price di tabel product_attribute_value
        DB::statement('ALTER TABLE product_attribute_value MODIFY COLUMN price DECIMAL(15,2) DEFAULT 0');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE products MODIFY COLUMN harga INT DEFAULT 0');
        DB::statement('ALTER TABLE product_attribute_value MODIFY COLUMN price INT DEFAULT 0');
    }
};
