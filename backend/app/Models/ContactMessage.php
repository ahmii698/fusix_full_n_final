<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $table = 'contact_messages';
    
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'is_read',
        'is_replied',
        'replied_at'
    ];
    
    protected $casts = [
        'is_read' => 'boolean',
        'is_replied' => 'boolean',
        'replied_at' => 'datetime'
    ];
    
    protected $attributes = [
        'is_read' => false,
        'is_replied' => false
    ];
    
    // Sirf unread messages
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
    
    // Sirf read messages
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }
    
    // Sirf unreplied messages
    public function scopeUnreplied($query)
    {
        return $query->where('is_replied', false);
    }
    
    // Mark as read
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }
    
    // Mark as replied
    public function markAsReplied()
    {
        $this->update([
            'is_replied' => true,
            'replied_at' => now()
        ]);
    }
}