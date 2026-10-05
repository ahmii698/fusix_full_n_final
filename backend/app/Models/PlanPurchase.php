<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanPurchase extends Model
{
    use HasFactory;

    protected $table = 'plan_purchases';

    protected $fillable = [
        'plan_id',
        'plan_name',
        'price',
        'period',
        'customer_name',
        'customer_email',
        'customer_phone',
        'message',
        'status'
    ];
}