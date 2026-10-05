<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $table = 'portfolio';
    
    protected $fillable = [
        'title', 'category', 'image', 'client_name', 'project_year',
        'description', 'project_url', 'is_featured', 'order_number', 'is_active'
    ];
    
    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean'
    ];
    
    public function technologies()
    {
        return $this->hasMany(PortfolioTechnology::class, 'portfolio_id');
    }
}