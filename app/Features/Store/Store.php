<?php

namespace App\Features\Store;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Store extends Model
{
    /**
     * Disable timestamps for this model.
     */
    public $timestamps = false;

    protected $fillable = [
        'name',
        'slug',
        'image',
        'address',
        'phone',
        'whatsapp',
        'email',
        'hours_weekday',
        'hours_saturday',
        'hours_sunday',
        'operating_hours',
        'google_maps_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'operating_hours' => 'array',
    ];

    protected $appends = ['image_url'];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($store) {
            if (empty($store->slug)) {
                $store->slug = Str::slug($store->name);
            }
        });

        static::updating(function ($store) {
            if ($store->isDirty('name') && empty($store->slug)) {
                $store->slug = Str::slug($store->name);
            }
        });
    }

    /**
     * Get the image URL
     */
    public function getImageUrlAttribute(): ?string
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    /**
     * Scope for active stores
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
