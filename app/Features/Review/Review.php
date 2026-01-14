<?php

namespace App\Features\Review;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Features\Customer\Customer;
use App\Features\Product\Product;
use App\Features\Order\Order;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'customer_id',
        'product_id',
        'order_id',
        'rating',
        'comment',
        'photos',
        'is_visible',
        'is_edited',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'rating' => 'integer',
        'photos' => 'array',
        'is_visible' => 'boolean',
        'is_edited' => 'boolean',
    ];

    /**
     * Get the customer that wrote the review.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the product that was reviewed.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id_produk');
    }

    /**
     * Get the order this review belongs to.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
