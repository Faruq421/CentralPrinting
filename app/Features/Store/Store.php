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
     * Boot method to auto-generate unique slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($store) {
            $store->slug = static::generateUniqueSlug($store->name);
        });

        static::updating(function ($store) {
            if ($store->isDirty('name')) {
                $store->slug = static::generateUniqueSlug($store->name, $store->id);
            }
        });
    }

    /**
     * Generate a unique slug for the store.
     *
     * @param string $name
     * @param int|null $excludeId
     * @return string
     */
    protected static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        $query = static::where('slug', $slug);
        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
            
            $query = static::where('slug', $slug);
            if ($excludeId !== null) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
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
