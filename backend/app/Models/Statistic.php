<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    protected $table = 'statistics';
    
    protected $fillable = [
        'icon',
        'label',
        'value',
        'suffix',
        'order_number',
        'is_active'
    ];
    
    protected $attributes = [
        'is_active' => true,
        'order_number' => 0,
        'suffix' => '+'
    ];
    
    // Sirf active statistics
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