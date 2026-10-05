<?php
// backend/public/send-email.php
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit();
}

$to = $input['to'] ?? '';
$subject = $input['subject'] ?? '';
$message = $input['message'] ?? '';
$customerName = $input['name'] ?? 'Customer';

if (empty($to) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit();
}

// Gmail SMTP settings - teri env se utha li
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'xahmedmalik30600@gmail.com';
    $mail->Password   = 'aockufncisebdhyk';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('xahmedmalik30600@gmail.com', 'TopTech Website');
    $mail->addAddress($to, $customerName);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    
    $htmlMessage = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Admin Response</h2>
            </div>
            <div class='content'>
                <p>Dear <strong>" . htmlspecialchars($customerName) . "</strong>,</p>
                <div class='message-box'>
                    " . nl2br(htmlspecialchars($message)) . "
                </div>
                <p>Best regards,<br><strong>TopTech Support Team</strong></p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " TopTech Website. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->Body = $htmlMessage;
    $mail->AltBody = strip_tags($message);

    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully',
        'to' => $to
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Email failed: ' . $mail->ErrorInfo
    ]);
}
?>