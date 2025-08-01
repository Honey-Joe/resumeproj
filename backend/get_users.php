<?php
// get_users.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// === Admin Token Auth Check ===
// $headers = array_change_key_case(getallheaders(), CASE_LOWER);
// $token = '';

// if (isset($headers['authorization'])) {
//     $authHeader = $headers['authorization'];
//     if (stripos($authHeader, 'Bearer ') === 0) {
//         $token = trim(substr($authHeader, 7));
//     }
// }

// $adminSecret = 'adminsecret'; // same as login.php

// if ($token !== $adminSecret) {
//     http_response_code(403);
//     echo json_encode([
//         'success' => false,
//         'message' => 'Unauthorized access. Invalid or missing token.'
//     ]);
//     exit;
// }

// === Fetch Users Data ===
$sql = "SELECT id, name, email, age, role, created_at FROM users ORDER BY created_at DESC";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database query failed',
        'error' => $conn->error
    ]);
    exit;
}

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'age' => $row['age'],
        'role' => $row['role'],
        'createdAt' => $row['created_at']
    ];
}

echo json_encode([
    'success' => true,
    'users' => $users
]);
?>
