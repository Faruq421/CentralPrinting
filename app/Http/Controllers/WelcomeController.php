<?php

namespace App\Http\Controllers;

use App\Features\HeroSlide\HeroSlide;
use App\Features\Product\Product;
use App\Features\Product\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Menampilkan halaman utama dengan data produk.
     */
    public function index()
    {
        // Mengambil data Hero Section dari database
        $heroSlides = HeroSlide::active()
            ->mainSlider()
            ->orderBy('sort_order')
            ->get();

        $promoCards = HeroSlide::active()
            ->promoCards()
            ->orderBy('card_slot')
            ->get();

        // Mengambil 4 produk unggulan (fitur) untuk HeroSection
        $featuredProducts = Product::with('category')
            ->where('status', true)
            ->inRandomOrder()
            ->take(4)
            ->get();

        // Mengambil semua kategori BESERTA 4 produk terbaru dari masing-masing kategori
        $categories = Category::with(['products' => function ($query) {
            $query->with('category')
                  ->where('status', true)
                  ->latest()
                  ->take(4);
        }])->get();

        // Produk rekomendasi acak untuk feed bawah
        $recommendations = Product::with('category')
             ->where('status', true)
             ->inRandomOrder()
             ->take(10)
             ->get();

        return Inertia::render('welcome', [
            'heroSlides' => $heroSlides,
            'promoCards' => $promoCards,
            'products' => $recommendations,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
