<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banners';
    
    protected $fillable = [
        'text',
        'is_active',
        'order_number'
    ];
    
    protected $attributes = [
        'is_active' => true,
        'order_number' => 0
    ];
    
    // Sirf active banners lane ke liye
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Order number ke hisaab se sort karne ke liye
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
}