<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About3Main extends Model
{
    use HasFactory;

    protected $table = 'about_3_main';
    public $timestamps = false;

    protected $fillable = [
        'section_tag',
        'heading_white',
        'heading_yellow',
        'paragraph_1',
        'paragraph_2',
        'image_path',
        'feature_1',
        'feature_2',
        'feature_3',
        'feature_4'
    ];
}