<?php

namespace App\Features\HeroSlide;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class HeroSlide extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'position',
        'card_slot',
        'title',
        'subtitle',
        'description',
        'image',
        'gradient_from',
        'gradient_to',
        'button_enabled',
        'button_text',
        'button_link_type',
        'button_link_value',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'button_enabled' => 'boolean',
        'is_active' => 'boolean',
        'card_slot' => 'integer',
        'sort_order' => 'integer',
    ];

    protected $appends = ['image_url'];

    /**
     * Accessor: URL publik untuk gambar hero slide.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        return Storage::url($this->image);
    }

    /**
     * Scope: Hanya slide yang aktif.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Hanya slide carousel utama.
     */
    public function scopeMainSlider($query)
    {
        return $query->where('position', 'main_slider');
    }

    /**
     * Scope: Hanya kartu promo.
     */
    public function scopePromoCards($query)
    {
        return $query->where('position', 'promo_card');
    }
}
