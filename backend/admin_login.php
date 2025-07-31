<?php
// admin_login.php
header("Content-Type: application/json");
require_once 'functions.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = sanitizeInput($data['username'] ?? '');
$password = sanitizeInput($data['password'] ?? '');

if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
    $token = generateJWT('admin', 'admin');
    
    http_response_code(200);
    echo json_encode([
        'message' => 'Admin login successful',
        'token' => $token
    ]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid admin credentials']);
}