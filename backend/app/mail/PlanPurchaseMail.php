<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PlanPurchaseMail extends Mailable
{
    use Queueable, SerializesModels;

    public $purchase;

    public function __construct($purchase)
    {
        $this->purchase = $purchase;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Plan Purchase: ' . $this->purchase['plan_name'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.plan-purchase',
        );
    }
}