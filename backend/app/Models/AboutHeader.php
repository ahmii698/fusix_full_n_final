<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutHeader extends Model
{
    use HasFactory;

    protected $table = 'about_header';
    public $timestamps = false;

    protected $fillable = [
        'top_tagline',
        'main_heading_white',
        'main_heading_yellow',
        'description'
    ];
}