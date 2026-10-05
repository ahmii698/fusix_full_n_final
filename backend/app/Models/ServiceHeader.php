<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceHeader extends Model
{
    use HasFactory;

    protected $table = 'service_header';
    public $timestamps = false;

    protected $fillable = [
        'top_tagline',
        'main_heading_white',
        'main_heading_yellow',
        'description'
    ];
}