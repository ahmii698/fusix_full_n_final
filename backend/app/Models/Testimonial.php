<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $table = 'testimonials';
    
    protected $fillable = [
        'client_name',
        'testimonial_text',
        'rating',
        'order_number',
        'is_active',
        'is_approved'  // ✅ ADD THIS
    ];
    
    protected $casts = [
        'rating' => 'integer',
        'is_active' => 'boolean',
        'is_approved' => 'boolean'  // ✅ ADD THIS
    ];
    
    protected $attributes = [
        'is_active' => true,
        'is_approved' => false,  // ✅ ADD THIS (default pending)
        'order_number' => 0,
        'rating' => 5
    ];
    
    // Sirf active testimonials
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // ✅ ADD THIS - Sirf approved testimonials (website par dikhane ke liye)
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
    
    // ✅ ADD THIS - Sirf pending testimonials (admin review ke liye)
    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }
    
    // Order by order_number
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
    
    // Filter by rating (e.g., 5 star testimonials)
    public function scopeOfRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }
    
    // Sirf high rating (4+ stars)
    public function scopeHighRated($query)
    {
        return $query->where('rating', '>=', 4);
    }
}