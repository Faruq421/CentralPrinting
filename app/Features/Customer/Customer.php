<?php

namespace App\Features\Customer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Features\Order\Order;
use App\Features\Review\Review;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // SYNC_FILLABLE_START
    protected $fillable = [
        'user_id',
        'phone_number',
        'address',
        'city',
        'province'
    ];
    // SYNC_FILLABLE_END

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    // SYNC_CASTS_START
    protected $casts = [

    ];


    // SYNC_CASTS_END

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all orders for this customer.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get all reviews written by this customer.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
