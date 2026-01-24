<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menghapus kolom timestamps (created_at, updated_at) dari beberapa tabel
     * dan deleted_at dari tabel customers.
     */
    public function up(): void
    {
        // 1. Users - hapus timestamps
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('users', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });

        // 2. Customers - hapus timestamps DAN deleted_at
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('customers', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
            if (Schema::hasColumn('customers', 'deleted_at')) {
                $table->dropColumn('deleted_at');
            }
        });

        // 3. Categories - hapus timestamps
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('categories', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });

        // 4. Attributes - hapus timestamps
        Schema::table('attributes', function (Blueprint $table) {
            if (Schema::hasColumn('attributes', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('attributes', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });

        // 5. Attribute_values - hapus timestamps
        Schema::table('attribute_values', function (Blueprint $table) {
            if (Schema::hasColumn('attribute_values', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('attribute_values', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });

        // 6. Design_templates - hapus timestamps
        Schema::table('design_templates', function (Blueprint $table) {
            if (Schema::hasColumn('design_templates', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('design_templates', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });

        // 7. Stores - hapus timestamps
        Schema::table('stores', function (Blueprint $table) {
            if (Schema::hasColumn('stores', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('stores', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });

        // 8. Product_attribute_value - hapus timestamps
        Schema::table('product_attribute_value', function (Blueprint $table) {
            if (Schema::hasColumn('product_attribute_value', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('product_attribute_value', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Users - tambah kembali timestamps
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // 2. Customers - tambah kembali timestamps dan deleted_at
        Schema::table('customers', function (Blueprint $table) {
            if (!Schema::hasColumn('customers', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('customers', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
            if (!Schema::hasColumn('customers', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 3. Categories - tambah kembali timestamps
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('categories', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // 4. Attributes - tambah kembali timestamps
        Schema::table('attributes', function (Blueprint $table) {
            if (!Schema::hasColumn('attributes', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('attributes', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // 5. Attribute_values - tambah kembali timestamps
        Schema::table('attribute_values', function (Blueprint $table) {
            if (!Schema::hasColumn('attribute_values', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('attribute_values', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // 6. Design_templates - tambah kembali timestamps
        Schema::table('design_templates', function (Blueprint $table) {
            if (!Schema::hasColumn('design_templates', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('design_templates', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // 7. Stores - tambah kembali timestamps
        Schema::table('stores', function (Blueprint $table) {
            if (!Schema::hasColumn('stores', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('stores', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // 8. Product_attribute_value - tambah kembali timestamps
        Schema::table('product_attribute_value', function (Blueprint $table) {
            if (!Schema::hasColumn('product_attribute_value', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('product_attribute_value', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });
    }
};
