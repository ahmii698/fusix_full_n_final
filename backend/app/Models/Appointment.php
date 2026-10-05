<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';

    public $timestamps = false;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'appointment_date',
        'appointment_time',
        'message'
    ];
}