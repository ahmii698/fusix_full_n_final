<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function sendEmail(Request $request)
    {
        try {
            $request->validate([
                'to' => 'required|email',
                'subject' => 'required|string',
                'message' => 'required|string',
                'name' => 'required|string'
            ]);

            $to = $request->to;
            $subject = $request->subject;
            $message = $request->message;
            $name = $request->name;

            Mail::send([], [], function ($mail) use ($to, $subject, $message, $name) {
                $mail->to($to, $name)
                    ->subject($subject)
                    ->html("
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset='UTF-8'>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                            </style>
                        </head>
                        <body>
                            <div class='container'>
                                <div class='header'>
                                    <h2>Admin Response</h2>
                                </div>
                                <div class='content'>
                                    <p>Dear <strong>" . htmlspecialchars($name) . "</strong>,</p>
                                    <div class='message-box'>
                                        " . nl2br(htmlspecialchars($message)) . "
                                    </div>
                                    <p>Best regards,<br><strong>Admin Team</strong></p>
                                </div>
                            </div>
                        </body>
                        </html>
                    ");
            });

            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Appointment email
    public function sendAppointmentEmail($id, Request $request)
    {
        // Code for appointment email
    }

    // Plan order email  
    public function sendPlanOrderEmail($id, Request $request)
    {
        // Code for plan order email
    }
}