<?php

namespace App\Features\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of stores (Admin)
     */
    public function index()
    {
        $stores = Store::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('Features/Store/Index', [
            'items' => $stores,
        ]);
    }

    /**
     * Show the form for creating a new store
     */
    public function create()
    {
        return Inertia::render('Features/Store/FormPage', [
            'store' => null,
        ]);
    }

    /**
     * Store a newly created store
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'operating_hours' => 'nullable|array',
            'operating_hours.*.days' => 'required|array',
            'operating_hours.*.hours' => 'required|string',
            'google_maps_url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('stores', 'public');
        }

        Store::create($validated);

        return redirect()->route('stores.index')->with('success', 'Toko berhasil ditambahkan!');
    }

    /**
     * Show the form for editing the specified store
     */
    public function edit(Store $store)
    {
        return Inertia::render('Features/Store/FormPage', [
            'store' => $store,
        ]);
    }

    /**
     * Update the specified store
     */
    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'operating_hours' => 'nullable|array',
            'operating_hours.*.days' => 'required|array',
            'operating_hours.*.hours' => 'required|string',
            'google_maps_url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($store->image) {
                Storage::disk('public')->delete($store->image);
            }
            $validated['image'] = $request->file('image')->store('stores', 'public');
        }

        $store->update($validated);

        return redirect()->route('stores.index')->with('success', 'Toko berhasil diperbarui!');
    }

    /**
     * Remove the specified store
     */
    public function destroy(Store $store)
    {
        // Delete image if exists
        if ($store->image) {
            Storage::disk('public')->delete($store->image);
        }

        $store->delete();

        return redirect()->route('stores.index')->with('success', 'Toko berhasil dihapus!');
    }

    /**
     * Display stores for public (customer view)
     */
    public function locations()
    {
        $stores = Store::active()->orderBy('name')->get();

        return Inertia::render('Locations', [
            'stores' => $stores,
        ]);
    }
}
