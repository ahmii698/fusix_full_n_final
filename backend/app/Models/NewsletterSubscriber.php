<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $table = 'newsletter_subscribers';
    
    protected $fillable = [
        'email',
        'is_active',
        'unsubscribed_at'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'unsubscribed_at' => 'datetime'
    ];
    
    protected $attributes = [
        'is_active' => true
    ];
    
    // Sirf active subscribers
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Sirf unsubscribed users
    public function scopeUnsubscribed($query)
    {
        return $query->where('is_active', false);
    }
    
    // Find by email
    public function scopeFindByEmail($query, $email)
    {
        return $query->where('email', $email);
    }
    
    // Unsubscribe karne ka method
    public function unsubscribe()
    {
        $this->update([
            'is_active' => false,
            'unsubscribed_at' => now()
        ]);
    }
    
    // Re-subscribe karne ka method
    public function resubscribe()
    {
        $this->update([
            'is_active' => true,
            'unsubscribed_at' => null
        ]);
    }
}