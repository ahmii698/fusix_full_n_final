<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainBlog extends Model
{
    use HasFactory;

    protected $table = 'main_blog';
    public $timestamps = false;

    protected $fillable = [
        'category',
        'image',
        'post_date',
        'read_time',
        'title',
        'description',
        'author_name',
        'author_initial',
        'views',
        'likes',
        'comments',
        'tags',
        'is_featured',
        'display_order'
    ];
}