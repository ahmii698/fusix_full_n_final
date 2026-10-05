// backend/public/api/send-email.php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email']) || !isset($data['message'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$to = $data['email'];
$subject = $data['subject'] ?? 'No Subject';
$message = $data['message'];
$name = $data['name'] ?? 'Customer';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: admin@yourdomain.com\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Mail send failed']);
}