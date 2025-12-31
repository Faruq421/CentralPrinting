<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            // Add flexible operating hours as JSON column
            $table->json('operating_hours')->nullable()->after('hours_sunday');
        });

        // Migrate existing data to new format
        $stores = \App\Features\Store\Store::all();
        foreach ($stores as $store) {
            $operatingHours = [];
            
            // Convert old format to new flexible format
            if ($store->hours_weekday) {
                $operatingHours[] = [
                    'days' => ['senin', 'selasa', 'rabu', 'kamis', 'jumat'],
                    'hours' => $store->hours_weekday,
                ];
            }
            if ($store->hours_saturday) {
                $operatingHours[] = [
                    'days' => ['sabtu'],
                    'hours' => $store->hours_saturday,
                ];
            }
            if ($store->hours_sunday) {
                $operatingHours[] = [
                    'days' => ['minggu'],
                    'hours' => $store->hours_sunday,
                ];
            }

            if (!empty($operatingHours)) {
                $store->operating_hours = $operatingHours;
                $store->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('operating_hours');
        });
    }
};
