<?php
// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = 'localhost';
$dbname = 'toptech_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Get request data
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? $data['action'] ?? '';

// Handle different form types
if ($action === 'plan_purchase' || (isset($data['plan_id']) && isset($data['customer_name']))) {
    // Plan Purchase Form
    $plan_id = $data['plan_id'] ?? '';
    $plan_name = $data['plan_name'] ?? '';
    $price = $data['price'] ?? '';
    $period = $data['period'] ?? '';
    $customer_name = $data['customer_name'] ?? '';
    $customer_email = $data['customer_email'] ?? '';
    $customer_phone = $data['customer_phone'] ?? '';
    $message = $data['message'] ?? '';
    $status = 'pending';
    $created_at = date('Y-m-d H:i:s');
    
    $sql = "INSERT INTO plan_purchases (plan_id, plan_name, price, period, customer_name, customer_email, customer_phone, message, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$plan_id, $plan_name, $price, $period, $customer_name, $customer_email, $customer_phone, $message, $status, $created_at])) {
        echo json_encode(['success' => true, 'message' => 'Plan purchase saved successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to save plan purchase']);
    }
    
} elseif ($action === 'appointment' || (isset($data['full_name']) && isset($data['appointment_date']))) {
    // Appointment Form
    $full_name = $data['full_name'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $appointment_date = $data['appointment_date'] ?? '';
    $appointment_time = $data['appointment_time'] ?? '';
    $message = $data['message'] ?? '';
    $status = 'pending';
    $created_at = date('Y-m-d H:i:s');
    
    $sql = "INSERT INTO appointments (full_name, email, phone, appointment_date, appointment_time, message, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$full_name, $email, $phone, $appointment_date, $appointment_time, $message, $status, $created_at])) {
        echo json_encode(['success' => true, 'message' => 'Appointment booked successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to book appointment']);
    }
    
} elseif ($action === 'newsletter' || (isset($data['email']) && !isset($data['full_name']))) {
    // Newsletter Form
    $email = $data['email'] ?? '';
    $is_active = 1;
    $subscribed_at = date('Y-m-d H:i:s');
    
    // Check if email already exists
    $check = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
    $check->execute([$email]);
    
    if ($check->rowCount() > 0) {
        echo json_encode(['success' => false, 'error' => 'Email already subscribed']);
    } else {
        $sql = "INSERT INTO newsletter_subscribers (email, is_active, subscribed_at) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute([$email, $is_active, $subscribed_at])) {
            echo json_encode(['success' => true, 'message' => 'Subscribed successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to subscribe']);
        }
    }
    
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid action or missing data']);
}
?>