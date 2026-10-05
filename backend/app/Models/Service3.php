<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service3 extends Model
{
    use HasFactory;

    protected $table = 'service_3';
    public $timestamps = false;

    protected $fillable = [
        'section_tag',
        'heading_white',
        'heading_yellow',
        'sub_description',
        'step_number',
        'card_title',
        'card_description',
        'display_order'
    ];
}