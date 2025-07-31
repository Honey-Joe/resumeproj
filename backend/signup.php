<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
require_once './db.php';

// ✅ Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// ✅ Extract & sanitize
$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$age      = intval($data['age'] ?? 0);
$role     = trim($data['role'] ?? 'user');

// ✅ Validation
if (!$name || !$email || !$password || $age <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'All fields (name, email, password, age, role) are required'
    ]);
    exit;
}

// ✅ Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$checkResult = $check->get_result();

if ($checkResult && $checkResult->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Email already registered'
    ]);
    exit;
}

// ✅ Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// ✅ Insert into DB
$stmt = $conn->prepare("INSERT INTO users (name, email, password, age, role) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database prepare failed',
        'error' => (is_object($conn) ? $conn->error : 'Database connection error')
    ]);
    exit;
}

$stmt->bind_param("sssis", $name, $email, $hashedPassword, $age, $role);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Signup successful',
        'token'   => bin2hex(random_bytes(16))  // Replace with JWT if needed
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Signup failed',
        'error' => $stmt->error
    ]);
}
?>
