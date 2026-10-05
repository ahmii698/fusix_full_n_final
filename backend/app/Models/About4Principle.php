<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About4Principle extends Model
{
    use HasFactory;

    protected $table = 'about_4_principles';
    public $timestamps = false;

    protected $fillable = [
        'section_tag',
        'main_heading_white',
        'main_heading_yellow',
        'icon_class',
        'card_title',
        'card_description',
        'is_highlighted',
        'display_order'
    ];
}