<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    protected $table = 'pricing_plans';
    
    protected $fillable = [
        'name',
        'price',
        'period',
        'is_recommended',
        'button_text',
        'button_link',
        'order_number',
        'is_active'
    ];
    
    protected $casts = [
        'is_recommended' => 'boolean',
        'is_active' => 'boolean'
    ];
    
    protected $attributes = [
        'is_active' => true,
        'is_recommended' => false,
        'order_number' => 0,
        'period' => 'project',
        'button_text' => 'Get Started',
        'button_link' => '#'
    ];
    
    // Relationship - Plan ke saare features
    public function features()
    {
        return $this->hasMany(PricingFeature::class, 'plan_id');
    }
    
    // Sirf active plans
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Sirf recommended plans
    public function scopeRecommended($query)
    {
        return $query->where('is_recommended', true);
    }
    
    // Order by order_number
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
}