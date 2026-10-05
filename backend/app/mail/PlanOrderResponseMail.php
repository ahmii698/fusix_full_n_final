<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PlanOrderResponseMail extends Mailable
{
    use Queueable, SerializesModels;
    
    public $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }
    
    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
                    ->subject($this->data['subject'])
                    ->view('emails.plan-order-response')
                    ->with('data', $this->data);
    }
}