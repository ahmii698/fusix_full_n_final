<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingFeature extends Model
{
    protected $table = 'pricing_features';
    
    protected $fillable = [
        'plan_id',
        'feature'
    ];
    
    // Relationship - Ye feature kis pricing plan ka hai
    public function plan()
    {
        return $this->belongsTo(PricingPlan::class, 'plan_id');
    }
    
    // Kisi specific plan ki features lane ke liye
    public function scopeOfPlan($query, $planId)
    {
        return $query->where('plan_id', $planId);
    }
}