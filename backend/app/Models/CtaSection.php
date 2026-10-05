<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CtaSection extends Model
{
    protected $table = 'cta_section';
    
    protected $fillable = [
        'title',
        'description',
        'button_text',
        'button_link',
        'background_image',
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