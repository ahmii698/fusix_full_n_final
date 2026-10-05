<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactHeader extends Model
{
    use HasFactory;

    protected $table = 'contact_header';
    public $timestamps = false;

    protected $fillable = [
        'top_tagline',
        'main_heading_white_1',
        'main_heading_yellow',
        'main_heading_white_2',
        'description'
    ];
}