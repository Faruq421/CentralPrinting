<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan timestamps pada tabel pivot yang belum memilikinya.
     */
    public function up(): void
    {
        // Tambahkan timestamps ke product_design_template jika belum ada
        if (!Schema::hasColumn('product_design_template', 'created_at')) {
            Schema::table('product_design_template', function (Blueprint $table) {
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('product_design_template', 'created_at')) {
            Schema::table('product_design_template', function (Blueprint $table) {
                $table->dropTimestamps();
            });
        }
    }
};
