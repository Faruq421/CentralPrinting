<?php

namespace App\Features\Portfolio;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        $portfolioItems = [
            [
                'id' => 1,
                'title' => 'Branding Mewah "Golden Hour"',
                'category' => 'Kartu Nama',
                'image' => 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Business Cards
                'desc' => 'Cetak kartu nama dengan foil emas di atas kertas hitam matte bertekstur.'
            ],
            [
                'id' => 2,
                'title' => 'Kampanye Baliho "Summer Vibe"',
                'category' => 'Large Format',
                'image' => 'https://images.unsplash.com/photo-1559067515-bf7d799b6d42?q=80&w=1000&auto=format&fit=crop', // Billboard
                'desc' => 'Instalasi baliho luar ruang tahan cuaca dengan ketajaman warna tinggi.'
            ],
            [
                'id' => 3,
                'title' => 'Kemasan Kosmetik "Pure Skin"',
                'category' => 'Packaging',
                'image' => 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=1000&auto=format&fit=crop', // Packaging
                'desc' => 'Desain kemasan minimalis dengan laminasi doff dan spot UV.'
            ],
            [
                'id' => 4,
                'title' => 'Merchandise Perusahaan Tech',
                'category' => 'Merchandise',
                'image' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop', // Mug/Merch
                'desc' => 'Set merchandise korporat lengkap: Mug, USB, dan Pulpen custom.'
            ],
            [
                'id' => 5,
                'title' => 'Brosur Lipat Tiga "Property Expo"',
                'category' => 'Digital Printing',
                'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop', // Brochure
                'desc' => 'Brosur marketing properti dengan kertas art paper 150gsm.'
            ],
             [
                'id' => 6,
                'title' => 'Stiker Label Makanan Ringan',
                'category' => 'Stiker & Label',
                'image' => 'https://images.unsplash.com/photo-1616941842754-d46797203d9c?q=80&w=1000&auto=format&fit=crop', // Stickers
                'desc' => 'Stiker vinyl tahan air dengan potongan die-cut presisi.'
            ],
        ];

        return Inertia::render('Features/Portfolio/Index', [
            'portfolioItems' => $portfolioItems,
        ]);
    }
}
