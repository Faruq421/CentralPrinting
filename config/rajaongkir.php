<?php

return [
    /*
    |--------------------------------------------------------------------------
    | RajaOngkir API Key
    |--------------------------------------------------------------------------
    |
    | API Key dari RajaOngkir/Komerce untuk mengakses layanan ongkos kirim.
    |
    */
    'api_key' => env('RAJAONGKIR_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Base URL
    |--------------------------------------------------------------------------
    |
    | Base URL untuk API RajaOngkir. Gunakan URL Komerce jika menggunakan
    | layanan Komerce RajaOngkir.
    |
    */
    'base_url' => env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'),

    /*
    |--------------------------------------------------------------------------
    | Origin City
    |--------------------------------------------------------------------------
    |
    | ID kota asal pengiriman (default: 501 = Yogyakarta).
    |
    */
    'origin_city' => env('RAJAONGKIR_ORIGIN_CITY', 501),
];
