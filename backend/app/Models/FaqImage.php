<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaqImage extends Model
{
    protected $table = 'faq_images';
    
    protected $fillable = [
        'image_url',
        'alt_text',
        'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean'
    ];
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}