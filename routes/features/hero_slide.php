<?php

use App\Features\HeroSlide\HeroSlideController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('hero-slides')->group(function () {
    Route::get('/', [HeroSlideController::class, 'index'])->name('hero-slides.index');
    Route::post('/', [HeroSlideController::class, 'store'])->name('hero-slides.store');
    Route::post('/reorder', [HeroSlideController::class, 'reorder'])->name('hero-slides.reorder');
    Route::post('/{heroSlide}', [HeroSlideController::class, 'update'])->name('hero-slides.update');
    Route::delete('/{heroSlide}', [HeroSlideController::class, 'destroy'])->name('hero-slides.destroy');
});
