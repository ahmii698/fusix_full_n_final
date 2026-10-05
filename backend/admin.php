<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'toptech_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$table = $request[0] ?? '';
$id = $request[1] ?? null;

$allowedTables = ['banners', 'blog_posts', 'company_info', 'contact_messages', 'cta_section', 'faqs', 'features', 'hero_section', 'newsletter_subscribers', 'pages', 'plan_purchases', 'portfolio', 'portfolio_technologies', 'pricing_features', 'pricing_plans', 'process_steps', 'services', 'service_features', 'statistics', 'team_members', 'technologies', 'testimonials', 'users', 'appointments'];

if (!in_array($table, $allowedTables)) {
    die(json_encode(['error' => 'Invalid table: ' . $table]));
}

try {
    switch($method) {
        case 'GET':
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->query("SELECT * FROM `$table` ORDER BY id DESC");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data) {
                $columns = array_keys($data);
                $placeholders = ':' . implode(', :', $columns);
                $sql = "INSERT INTO `$table` (" . implode(',', $columns) . ") VALUES (" . $placeholders . ")";
                $stmt = $pdo->prepare($sql);
                foreach($data as $key => $value) {
                    $stmt->bindValue(":$key", $value);
                }
                $stmt->execute();
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            } else {
                echo json_encode(['error' => 'No data provided']);
            }
            break;
            
        case 'PUT':
            if (!$id) { echo json_encode(['error' => 'ID required']); break; }
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data) {
                $set = [];
                foreach(array_keys($data) as $col) { $set[] = "$col = :$col"; }
                $sql = "UPDATE `$table` SET " . implode(', ', $set) . " WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                foreach($data as $key => $value) { $stmt->bindValue(":$key", $value); }
                $stmt->bindValue(':id', $id);
                $stmt->execute();
                echo json_encode(['success' => true]);
            }
            break;
            
        case 'DELETE':
            if (!$id) { echo json_encode(['error' => 'ID required']); break; }
            $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;
            
        default:
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>