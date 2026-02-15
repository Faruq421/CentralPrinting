<?php

namespace App\Features\HeroSlide;

use App\Http\Controllers\Controller;
use App\Features\Product\Product;
use App\Features\Product\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeroSlideController extends Controller
{
    /**
     * Tampilkan halaman manajemen Hero Section untuk admin.
     */
    public function index()
    {
        $mainSlides = HeroSlide::mainSlider()
            ->orderBy('sort_order')
            ->get();

        $promoCards = HeroSlide::promoCards()
            ->orderBy('card_slot')
            ->get();

        // Data untuk dropdown target link di frontend
        $products = Product::where('status', true)
            ->select('id_produk', 'nama_produk', 'slug')
            ->orderBy('nama_produk')
            ->get();

        $categories = Category::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Features/HeroSlide/Index', [
            'mainSlides' => $mainSlides,
            'promoCards' => $promoCards,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Tambah slide baru (hanya untuk main_slider).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'subtitle' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:2048',
            'gradient_from' => 'nullable|string|max:50',
            'gradient_to' => 'nullable|string|max:50',
            'button_enabled' => 'required|boolean',
            'button_text' => 'nullable|string|max:50',
            'button_link_type' => 'nullable|in:product,category,custom_url',
            'button_link_value' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        // Hanya main_slider yang bisa ditambah
        $validated['position'] = 'main_slider';
        $validated['sort_order'] = HeroSlide::mainSlider()->max('sort_order') + 1;

        // Upload gambar jika ada
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('hero-slides', 'public');
        }

        // Set default gradient jika tidak disediakan
        if (empty($validated['gradient_from'])) {
            $validated['gradient_from'] = 'orange-600';
        }
        if (empty($validated['gradient_to'])) {
            $validated['gradient_to'] = 'amber-600';
        }

        HeroSlide::create($validated);

        return redirect()->back()->with('success', 'Slide berhasil ditambahkan.');
    }

    /**
     * Update slide atau kartu promo yang sudah ada.
     */
    public function update(Request $request, HeroSlide $heroSlide)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'subtitle' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:2048',
            'gradient_from' => 'nullable|string|max:50',
            'gradient_to' => 'nullable|string|max:50',
            'button_enabled' => 'required|boolean',
            'button_text' => 'nullable|string|max:50',
            'button_link_type' => 'nullable|in:product,category,custom_url',
            'button_link_value' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        // Upload gambar baru jika ada
        if ($request->hasFile('image')) {
            // Hapus gambar lama
            if ($heroSlide->image) {
                Storage::disk('public')->delete($heroSlide->image);
            }
            $validated['image'] = $request->file('image')->store('hero-slides', 'public');
        }

        // Jika admin ingin menghapus gambar secara eksplisit (kembali ke gradient)
        if ($request->boolean('remove_image') && !$request->hasFile('image')) {
            if ($heroSlide->image) {
                Storage::disk('public')->delete($heroSlide->image);
            }
            $validated['image'] = null;
        }

        $heroSlide->update($validated);

        return redirect()->back()->with('success', 'Slide berhasil diperbarui.');
    }

    /**
     * Hapus slide (hanya untuk main_slider).
     */
    public function destroy(HeroSlide $heroSlide)
    {
        // Kartu promo tidak boleh dihapus
        if ($heroSlide->position === 'promo_card') {
            return redirect()->back()->with('error', 'Kartu promo tidak dapat dihapus.');
        }

        // Hapus gambar dari storage
        if ($heroSlide->image) {
            Storage::disk('public')->delete($heroSlide->image);
        }

        $heroSlide->delete();

        return redirect()->back()->with('success', 'Slide berhasil dihapus.');
    }

    /**
     * Ubah urutan slide carousel.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|exists:hero_slides,id',
            'order.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->order as $item) {
            HeroSlide::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return redirect()->back()->with('success', 'Urutan slide berhasil diperbarui.');
    }
}
