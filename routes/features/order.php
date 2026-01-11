<?php

use Illuminate\Support\Facades\Route;
use App\Features\Order\OrderController;
use App\Http\Controllers\Features\RajaOngkirController;

// RajaOngkir Shipping API Routes (public, no auth required for provinces/cities)
Route::prefix('shipping')->name('shipping.')->group(function () {
    Route::get('/provinces', [RajaOngkirController::class, 'getProvinces'])->name('provinces');
    Route::get('/cities/{provinceId}', [RajaOngkirController::class, 'getCities'])->name('cities');
    Route::post('/cost', [RajaOngkirController::class, 'calculateCost'])->name('cost');
    Route::post('/all-options', [RajaOngkirController::class, 'getAllShippingOptions'])->name('all-options');
});

// Rute untuk Customer (checkout, my-orders, payment update)
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', [OrderController::class, 'create'])->name('checkout.create');
    Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');
    
    // Rute untuk halaman "Pesanan Saya" pelanggan
    Route::get('/my-orders', [OrderController::class, 'myOrders'])->name('orders.my');
    
    // Rute untuk detail pesanan customer (harus di atas rute resource admin)
    Route::get('/my-orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    
    // Route untuk update status pembayaran setelah sukses dari Midtrans
    Route::post('/orders/{order}/mark-paid', [OrderController::class, 'markAsPaid'])
        ->name('orders.markPaid');
    
    // Route untuk customer membatalkan pesanan (hanya jika unpaid)
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancelOrder'])
        ->name('orders.cancel');
});

// Rute untuk Admin (CRUD orders - index, create, edit, update, destroy)
// Exclude 'show' karena sudah didefinisikan di atas untuk customer
Route::resource('orders', OrderController::class)
    ->middleware(['auth', 'verified', 'role:admin'])
    ->except(['show']);
