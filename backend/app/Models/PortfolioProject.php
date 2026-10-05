<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProject extends Model
{
    protected $table = 'portfolio_projects';
    
    protected $fillable = [
        'title',
        'description',
        'technologies',
        'image_1',
        'image_2',
        'image_3',
        'order_number',
        'is_active'
    ];
    
    protected $casts = [
        'technologies' => 'array',
        'is_active' => 'boolean'
    ];
}