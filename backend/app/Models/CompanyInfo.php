<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInfo extends Model
{
    protected $table = 'company_info';
    
    protected $fillable = [
        'address',
        'phone',
        'email',
        'business_hours',
        'map_embed_url',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'linkedin_url'
    ];
    
    // Company info usually single row hoti hai, isliye kisi scope ki need nahi
}