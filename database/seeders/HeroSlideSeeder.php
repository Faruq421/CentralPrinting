<?php

namespace Database\Seeders;

use App\Features\HeroSlide\HeroSlide;
use Illuminate\Database\Seeder;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        // === SLIDE CAROUSEL UTAMA ===

        HeroSlide::create([
            'position' => 'main_slider',
            'title' => 'Cetak Spanduk Kilat',
            'subtitle' => 'Promo Terbatas',
            'description' => 'Kualitas tajam, tahan cuaca, bisa ditunggu. Pesan sekarang, besok langsung jadi!',
            'gradient_from' => 'orange-600',
            'gradient_to' => 'amber-600',
            'button_enabled' => true,
            'button_text' => 'Lihat Penawaran',
            'button_link_type' => 'category',
            'button_link_value' => 'Spanduk',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        HeroSlide::create([
            'position' => 'main_slider',
            'title' => 'Merchandise Kantor',
            'subtitle' => 'Solusi Branding',
            'description' => 'Tingkatkan citra perusahaan dengan merchandise eksklusif dan berkualitas tinggi.',
            'gradient_from' => 'blue-600',
            'gradient_to' => 'indigo-600',
            'button_enabled' => true,
            'button_text' => 'Lihat Penawaran',
            'button_link_type' => 'category',
            'button_link_value' => 'Merchandise',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        HeroSlide::create([
            'position' => 'main_slider',
            'title' => 'Diskon Member Baru',
            'subtitle' => 'Spesial Member',
            'description' => 'Bergabung sekarang dan nikmati potongan harga spesial untuk transaksi pertama Anda.',
            'gradient_from' => 'emerald-600',
            'gradient_to' => 'teal-600',
            'button_enabled' => true,
            'button_text' => 'Lihat Penawaran',
            'button_link_type' => 'custom_url',
            'button_link_value' => '/register',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // === KARTU PROMO (2 kartu tetap) ===

        HeroSlide::create([
            'position' => 'promo_card',
            'card_slot' => 1,
            'title' => 'Kartu Nama',
            'subtitle' => 'Best Seller',
            'description' => 'Premium quality, mulai 25rb',
            'gradient_from' => 'orange-50',
            'gradient_to' => 'orange-50',
            'button_enabled' => true,
            'button_text' => 'Pesan Sekarang',
            'button_link_type' => 'category',
            'button_link_value' => 'Kartu Nama',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        HeroSlide::create([
            'position' => 'promo_card',
            'card_slot' => 2,
            'title' => 'Custom Pack',
            'subtitle' => 'New Arrival',
            'description' => 'Kemasan unik untuk brandmu',
            'gradient_from' => 'blue-50',
            'gradient_to' => 'blue-50',
            'button_enabled' => true,
            'button_text' => 'Lihat Katalog',
            'button_link_type' => 'category',
            'button_link_value' => 'Kemasan',
            'is_active' => true,
            'sort_order' => 2,
        ]);
    }
}
