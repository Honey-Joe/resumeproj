<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$identifier = trim($data['identifier'] ?? '');
$password = $data['password'] ?? '';

if (empty($identifier) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

// === Try Admin Login (by username) ===
$stmt = $conn->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->bind_param("s", $identifier);
$stmt->execute();
$result = $stmt->get_result();
$admin = $result->fetch_assoc();

if ($admin && password_verify($password, $admin['password'])) {
    echo json_encode([
        'success' => true,
        'token' => 'adminsecret',  // must match get_users.php
        'role' => 'admin'
    ]);
    exit;
}

// === Try User Login (by email) ===
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $identifier);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    // update last login
    $updateLogin = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateLogin->bind_param("i", $user['id']);
    $updateLogin->execute();

    echo json_encode([
        'success' => true,
        'token' => 'usersecret',  // optionally change to JWT later
        'role' => 'user'
    ]);
    exit;
}

// === If both fail ===
echo json_encode(['success' => false, 'message' => 'Invalid login credentials']);
exit;
?>
