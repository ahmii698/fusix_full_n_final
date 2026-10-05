<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About2 extends Model
{
    use HasFactory;

    protected $table = 'about_2';
    
    // Agar aapke table mein created_at/updated_at nahi hai toh yeh line lagayein
    public $timestamps = false; 

    protected $fillable = [
        'stat_number',
        'stat_label',
        'display_order'
    ];
}