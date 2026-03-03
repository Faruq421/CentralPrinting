<?php

use App\Http\Controllers\Features\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
|
| Routes for Midtrans payment integration.
|
*/

// Protected routes - require authentication
Route::middleware(['auth'])->group(function () {
    // Create Snap token for an order (obfuscated URL to bypass WAF)
    Route::post('/trx-token/{order}', [PaymentController::class, 'createSnapToken'])
        ->name('payment.createToken');
    
    // Get Midtrans client key for frontend
    Route::get('/trx-config', [PaymentController::class, 'getClientKey'])
        ->name('payment.clientKey');
});

// Webhook route - using '/ipn-handler' (IPN = Instant Payment Notification) to bypass WAF
// URL 'order-notify' was blocked by cPanel firewall because it contains 'order'
Route::post('/ipn-handler', [PaymentController::class, 'handleNotification'])
    ->name('payment.notification')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
