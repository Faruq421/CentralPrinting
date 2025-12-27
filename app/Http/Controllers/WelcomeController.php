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
        // Mengambil 8 produk terbaru yang statusnya aktif untuk CollectionSection
        // Eager load relasi 'category' untuk menghindari N+1 problem
        $products = Product::with('category')
            ->where('status', true)
            ->latest() // Mengurutkan dari yang terbaru
            ->take(8)  // Membatasi hanya 8 produk
            ->get();

        // Mengambil 4 produk unggulan (fitur) untuk HeroSection
        // Bisa berdasarkan kriteria lain seperti order count, tapi untuk saat ini kita ambil secara acak atau terbaru
        $featuredProducts = Product::with('category')
            ->where('status', true)
            ->inRandomOrder() // Ambil secara acak untuk variasi
            ->take(4)
            ->get();

        // Mengambil semua kategori untuk CategoriesSection
        $categories = Category::all();

        // Render komponen Inertia 'welcome' dan kirim data produk sebagai props
        return Inertia::render('welcome', [
            'products' => $products,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
