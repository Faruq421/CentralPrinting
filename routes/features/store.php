<?php

use App\Features\Store\StoreController;
use Illuminate\Support\Facades\Route;

// Admin routes for store management
Route::middleware(['auth', 'role:admin'])->prefix('stores')->group(function () {
    Route::get('/', [StoreController::class, 'index'])->name('stores.index');
    Route::get('/create', [StoreController::class, 'create'])->name('stores.create');
    Route::post('/', [StoreController::class, 'store'])->name('stores.store');
    Route::get('/{store}/edit', [StoreController::class, 'edit'])->name('stores.edit');
    Route::put('/{store}', [StoreController::class, 'update'])->name('stores.update');
    Route::delete('/{store}', [StoreController::class, 'destroy'])->name('stores.destroy');
});

// Public route for store locations
Route::get('/lokasi-toko', [StoreController::class, 'locations'])->name('locations.index');
