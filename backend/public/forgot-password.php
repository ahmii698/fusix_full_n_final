<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if ($email === 'xahmedmalik30600@gmail.com') {
    $otp = rand(100000, 999999);
    echo json_encode([
        'success' => true,
        'message' => 'OTP sent',
        'debug_otp' => $otp
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Email not found'
    ]);
}
?>