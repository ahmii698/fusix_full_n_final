<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceFeature extends Model
{
    protected $table = 'service_features';
    
    protected $fillable = [
        'service_id',
        'feature',
        'created_at'
    ];
    
    // Disable Laravel's automatic timestamps (no updated_at column)
    public $timestamps = false;
}