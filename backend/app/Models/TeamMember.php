<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $table = 'team_members';
    
    protected $fillable = [
        'name',
        'role',
        'expertise',
        'experience',      // ✅ ADD THIS
        'about',           // ✅ ADD THIS
        'image',
        'social_linkedin',
        'social_twitter',
        'social_github',
        'social_instagram', // ✅ CHANGE: social_behance -> social_instagram
        'order_number',
        'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean'
    ];
    
    protected $attributes = [
        'is_active' => true,
        'order_number' => 0
    ];
    
    // Sirf active team members
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Order by order_number
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
    
    // Get social media links as array
    public function getSocialLinksAttribute()
    {
        return [
            'linkedin' => $this->social_linkedin,
            'twitter' => $this->social_twitter,
            'github' => $this->social_github,
            'instagram' => $this->social_instagram  // ✅ CHANGE: behance -> instagram
        ];
    }
}