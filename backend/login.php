<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'db.php';

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$identifier = trim($data['identifier'] ?? '');
$password = $data['password'] ?? '';

if (empty($identifier) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

// === Try Admin Login ===
$stmt = $conn->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->bind_param("s", $identifier);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'SQL error: ' . $stmt->error]);
    exit;
}
$result = $stmt->get_result();
$admin = $result->fetch_assoc();
$stmt->close();

if ($admin && password_verify($password, $admin['password'])) {
    echo json_encode([
        'success' => true,
        'token' => 'adminsecret',
        'role' => 'admin'
    ]);
    exit;
}

// === Try User Login ===
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $identifier);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'SQL error: ' . $stmt->error]);
    exit;
}
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if ($user && password_verify($password, $user['password'])) {
    $updateLogin = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateLogin->bind_param("i", $user['id']);
    if (!$updateLogin->execute()) {
        echo json_encode(['success' => false, 'message' => 'Login update failed: ' . $updateLogin->error]);
        exit;
    }
    $updateLogin->close();

        echo json_encode([
  'success' => true,
  'token' => 'usersecret',
  'role' => 'user',
  'email' => $user['email'],
  'name' => $user['name']
]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid login credentials']);
exit;
?>
