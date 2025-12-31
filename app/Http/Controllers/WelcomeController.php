<?php

namespace App\Http\Controllers;

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
        // Mengambil 4 produk unggulan (fitur) untuk HeroSection
        $featuredProducts = Product::with('category')
            ->where('status', true)
            ->inRandomOrder()
            ->take(4)
            ->get();

        // Mengambil semua kategori BESERTA 4 produk terbaru dari masing-masing kategori
        // FIX: Eager load 'category' on the products as well, so ProductCard has access to product.category.name
        $categories = Category::with(['products' => function ($query) {
            $query->with('category') // <--- Added this to fix "undefined reading 'name'"
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
            'products' => $recommendations,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
