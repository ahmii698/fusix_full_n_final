<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSettings extends Model
{
    protected $table = 'site_settings';
    
    protected $fillable = [
        'site_name',
        'site_logo',
        'site_favicon',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'footer_text',
        'copyright_text'
    ];
}