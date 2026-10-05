<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FAQ extends Model
{
    protected $table = 'faqs';
    
    protected $fillable = [
        'question',
        'answer',
        'category',
        'order_number',
        'is_active'
    ];
    
    protected $attributes = [
        'is_active' => true,
        'order_number' => 0,
        'category' => 'general'
    ];
    
    // Sirf active FAQs
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Order by order_number
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
    
    // Filter by category
    public function scopeOfCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}