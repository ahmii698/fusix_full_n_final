<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogFeature extends Model
{
    use HasFactory;

    protected $table = 'blog_features';
    public $timestamps = false;

    protected $fillable = [
        'section_icon',
        'heading_white',
        'heading_yellow',
        'category',
        'image',
        'post_date',
        'read_time',
        'title',
        'description',
        'author_name',
        'author_role',
        'author_initial',
        'display_order'
    ];
}