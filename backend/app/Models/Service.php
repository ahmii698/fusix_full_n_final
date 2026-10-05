<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'services';
    
    protected $fillable = [
        'icon_name',
        'title', 
        'description',
        'category',
        'image',
        'link',
        'order_number',
        'is_active'
    ];
    
    protected $attributes = [
        'is_active' => true,
        'order_number' => 0
    ];
    
    public function features()
    {
        return $this->hasMany(ServiceFeature::class, 'service_id');
    }
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number');
    }
}