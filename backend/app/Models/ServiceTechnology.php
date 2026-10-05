<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceTechnology extends Model
{
    use HasFactory;

    protected $table = 'technologies';
    
    // Table mein created_at aur updated_at NULL hain, isliye timestamps off kar dein
    public $timestamps = false;

    protected $fillable = [
        'name',
        'icon',
        'category',
        'display_order',
        'is_active'
    ];
}