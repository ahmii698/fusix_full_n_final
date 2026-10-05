<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $table = 'features';
    
    protected $fillable = [
        'icon_name',
        'title',
        'description',
        'stats',
        'order_number',
        'is_active'
    ];
    
    protected $attributes = [
        'is_active' => true,
        'order_number' => 0
    ];
    
    // Sirf active features
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Order by order_number
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
}