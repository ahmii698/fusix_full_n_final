<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessStep extends Model
{
    protected $table = 'process_steps';
    
    protected $fillable = [
        'step_number',
        'title',
        'description',
        'order_number',
        'is_active'
    ];
    
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
    
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
}