<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RajaOngkirController extends Controller
{
    private $apiKey;
    private $baseUrl = 'https://rajaongkir.komerce.id/api/v1';
    private $originCity;

    public function __construct()
    {
        // IMPORTANT: Must use config() instead of env() for production (config cache)
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = config('rajaongkir.base_url', 'https://rajaongkir.komerce.id/api/v1');
        $this->originCity = config('rajaongkir.origin_city', 501);
    }

    /**
     * Create an HTTP client with SSL verification disabled.
     * This fixes cURL error 60 (SSL certificate problem) on various hosting environments.
     */
    private function httpClient()
    {
        return Http::withoutVerifying()->withHeaders([
            'key' => $this->apiKey,
        ]);
    }

    /**
     * Static fallback data for Indonesian provinces.
     * Used when API is unreachable (SSL issues, rate limits, etc.)
     */
    private function getStaticProvinces(): array
    {
        return [
            ['province_id' => '1', 'province' => 'Bali'],
            ['province_id' => '2', 'province' => 'Bangka Belitung'],
            ['province_id' => '3', 'province' => 'Banten'],
            ['province_id' => '4', 'province' => 'Bengkulu'],
            ['province_id' => '5', 'province' => 'DI Yogyakarta'],
            ['province_id' => '6', 'province' => 'DKI Jakarta'],
            ['province_id' => '7', 'province' => 'Gorontalo'],
            ['province_id' => '8', 'province' => 'Jambi'],
            ['province_id' => '9', 'province' => 'Jawa Barat'],
            ['province_id' => '10', 'province' => 'Jawa Tengah'],
            ['province_id' => '11', 'province' => 'Jawa Timur'],
            ['province_id' => '12', 'province' => 'Kalimantan Barat'],
            ['province_id' => '13', 'province' => 'Kalimantan Selatan'],
            ['province_id' => '14', 'province' => 'Kalimantan Tengah'],
            ['province_id' => '15', 'province' => 'Kalimantan Timur'],
            ['province_id' => '16', 'province' => 'Kalimantan Utara'],
            ['province_id' => '17', 'province' => 'Kepulauan Riau'],
            ['province_id' => '18', 'province' => 'Lampung'],
            ['province_id' => '19', 'province' => 'Maluku'],
            ['province_id' => '20', 'province' => 'Maluku Utara'],
            ['province_id' => '21', 'province' => 'Nanggroe Aceh Darussalam (NAD)'],
            ['province_id' => '22', 'province' => 'Nusa Tenggara Barat (NTB)'],
            ['province_id' => '23', 'province' => 'Nusa Tenggara Timur (NTT)'],
            ['province_id' => '24', 'province' => 'Papua'],
            ['province_id' => '25', 'province' => 'Papua Barat'],
            ['province_id' => '26', 'province' => 'Riau'],
            ['province_id' => '27', 'province' => 'Sulawesi Barat'],
            ['province_id' => '28', 'province' => 'Sulawesi Selatan'],
            ['province_id' => '29', 'province' => 'Sulawesi Tengah'],
            ['province_id' => '30', 'province' => 'Sulawesi Tenggara'],
            ['province_id' => '31', 'province' => 'Sulawesi Utara'],
            ['province_id' => '32', 'province' => 'Sumatera Barat'],
            ['province_id' => '33', 'province' => 'Sumatera Selatan'],
            ['province_id' => '34', 'province' => 'Sumatera Utara'],
        ];
    }

    /**
     * Get list of all provinces.
     */
    public function getProvinces()
    {
        // Check if API key is configured
        if (empty($this->apiKey) || $this->apiKey === 'your_api_key_here') {
            Log::warning('RajaOngkir: API key not configured, using static data');
            return response()->json([
                'success' => true,
                'data' => $this->getStaticProvinces(),
            ]);
        }

        // Try cache first
        $provinces = Cache::get('rajaongkir_provinces');
        if ($provinces) {
            return response()->json([
                'success' => true,
                'data' => $provinces,
            ]);
        }

        try {
            Log::info('RajaOngkir: Fetching provinces from API');
            $response = $this->httpClient()->get("{$this->baseUrl}/destination/province");

            $json = $response->json();
            Log::info('RajaOngkir: Province API response', ['status' => $response->status()]);

            if ($response->successful() && isset($json['data'])) {
                $provinces = $json['data'];
                Cache::put('rajaongkir_provinces', $provinces, 60 * 60 * 24);

                return response()->json([
                    'success' => true,
                    'data' => $provinces,
                ]);
            }

            // API returned but with error - use static fallback
            Log::warning('RajaOngkir: API returned error, using static fallback', [
                'message' => $json['message'] ?? $json['meta']['message'] ?? 'Unknown',
            ]);
            return response()->json([
                'success' => true,
                'data' => $this->getStaticProvinces(),
            ]);

        } catch (\Exception $e) {
            // Connection error (SSL, timeout, etc.) - use static fallback
            Log::error('RajaOngkir: Connection failed, using static fallback', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => true,
                'data' => $this->getStaticProvinces(),
            ]);
        }
    }

    /**
     * Get list of cities by province ID.
     */
    public function getCities($provinceId)
    {
        if (empty($this->apiKey) || $this->apiKey === 'your_api_key_here') {
            return response()->json([
                'success' => false,
                'message' => 'API Key RajaOngkir belum dikonfigurasi di .env',
                'data' => [],
            ], 400);
        }

        $cacheKey = "rajaongkir_cities_{$provinceId}";
        $cities = Cache::get($cacheKey);
        
        if ($cities) {
            return response()->json([
                'success' => true,
                'data' => $cities,
            ]);
        }

        try {
            Log::info("RajaOngkir: Fetching cities for province {$provinceId}");
            $response = $this->httpClient()->get("{$this->baseUrl}/destination/city/{$provinceId}");

            $json = $response->json();
            Log::info('RajaOngkir: Cities API response', ['status' => $response->status()]);

            if ($response->successful() && isset($json['data'])) {
                $cities = $json['data'];
                Cache::put($cacheKey, $cities, 60 * 60 * 24);

                return response()->json([
                    'success' => true,
                    'data' => $cities,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $json['message'] ?? $json['meta']['message'] ?? 'Gagal mengambil data kota',
                'data' => [],
            ], 400);

        } catch (\Exception $e) {
            Log::error('RajaOngkir: Cities fetch failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => [],
            ], 500);
        }
    }

    /**
     * Get all shipping options at once (combines multiple couriers).
     * Uses x-www-form-urlencoded format as required by Komerce API.
     */
    public function getAllShippingOptions(Request $request)
    {
        $validated = $request->validate([
            'destination' => 'required|integer',
            'weight' => 'required|integer|min:1',
        ]);

        // Komerce API uses colon-separated courier list
        $couriers = 'jne:tiki:pos';

        try {
            // Use asForm() to send as x-www-form-urlencoded
            $response = $this->httpClient()->asForm()->post("{$this->baseUrl}/calculate/domestic-cost", [
                'origin' => $this->originCity,
                'destination' => $validated['destination'],
                'weight' => $validated['weight'],
                'courier' => $couriers,
            ]);

            $json = $response->json();

            if ($response->successful() && isset($json['data']) && is_array($json['data'])) {
                $allCosts = [];
                
                // Komerce API returns flat array of services, not nested
                foreach ($json['data'] as $service) {
                    $courierCode = $service['code'] ?? 'unknown';
                    $courierName = $service['name'] ?? $courierCode;
                    $serviceName = $service['service'] ?? '';
                    
                    // Filter out expensive trucking/motor services for regular packages
                    $cost = (int)($service['cost'] ?? 0);
                    if ($cost > 100000) {
                        continue; // Skip very expensive services like trucking
                    }

                    $allCosts[] = [
                        'id' => strtolower($courierCode) . '_' . strtolower(str_replace([' ', '<', '>'], '_', $serviceName)),
                        'courier' => strtoupper($courierCode),
                        'courier_name' => $courierName,
                        'service' => $serviceName,
                        'description' => $service['description'] ?? '',
                        'cost' => $cost,
                        'etd' => str_replace(' day', '', $service['etd'] ?? '-'),
                    ];
                }

                // Sort by cost ascending
                usort($allCosts, fn($a, $b) => $a['cost'] <=> $b['cost']);

                return response()->json([
                    'success' => true,
                    'data' => $allCosts,
                ]);
            }

            // Return error with debug info
            return response()->json([
                'success' => false,
                'message' => $json['meta']['message'] ?? $json['message'] ?? 'Tidak ada layanan pengiriman tersedia',
                'data' => [],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => [],
            ], 500);
        }
    }

    /**
     * Calculate shipping cost for a single courier.
     */
    public function calculateCost(Request $request)
    {
        $validated = $request->validate([
            'destination' => 'required|integer',
            'weight' => 'required|integer|min:1',
            'courier' => 'required|string',
        ]);

        try {
            $response = $this->httpClient()->asForm()->post("{$this->baseUrl}/calculate/domestic-cost", [
                'origin' => $this->originCity,
                'destination' => $validated['destination'],
                'weight' => $validated['weight'],
                'courier' => $validated['courier'],
            ]);

            $json = $response->json();

            if ($response->successful() && isset($json['data'])) {
                $costs = [];
                foreach ($json['data'] as $courier) {
                    foreach ($courier['costs'] ?? [] as $service) {
                        foreach ($service['cost'] ?? [] as $cost) {
                            $costs[] = [
                                'courier' => strtoupper($courier['code'] ?? $validated['courier']),
                                'courier_name' => $courier['name'] ?? $validated['courier'],
                                'service' => $service['service'] ?? '',
                                'description' => $service['description'] ?? '',
                                'cost' => (int)($cost['value'] ?? 0),
                                'etd' => $cost['etd'] ?? '-',
                            ];
                        }
                    }
                }

                return response()->json([
                    'success' => true,
                    'data' => $costs,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $json['meta']['message'] ?? 'Gagal mengambil data ongkir',
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
