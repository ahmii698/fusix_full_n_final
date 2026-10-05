<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioTechnology extends Model
{
    protected $table = 'portfolio_technologies';
    
    protected $fillable = [
        'portfolio_id',
        'technology'
    ];
    
    // Relationship - Ye technology kis portfolio ki hai
    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class, 'portfolio_id');
    }
    
    // Kisi specific portfolio ki technologies lane ke liye
    public function scopeOfPortfolio($query, $portfolioId)
    {
        return $query->where('portfolio_id', $portfolioId);
    }
}