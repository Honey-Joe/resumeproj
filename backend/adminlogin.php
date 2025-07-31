<?php
// --- CORS Headers ---
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// --- Handle Preflight ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- DB Connection ---
require_once './db.php';

if (!$conn || ($conn instanceof mysqli && $conn->connect_error)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $conn->connect_error ?? 'Connection error'
    ]);
    exit;
}

// --- Get Input ---
$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

// --- Validation ---
if ((empty($username) && empty($email)) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Username or email and password are required'
    ]);
    exit;
}

// --- Try Admin Login First ---
if (!empty($username)) {
    $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();

    if ($admin && password_verify($password, $admin['password'])) {
        $token = bin2hex(random_bytes(16)); // Replace with real JWT if needed
        echo json_encode([
            'success' => true,
            'message' => 'Admin login successful',
            'role' => 'admin',
            'token' => $token,
            'admin_id' => $admin['id']
        ]);
        exit;
    }
}

// --- Try User Login ---
if (!empty($email)) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => true,
            'message' => 'User login successful',
            'role' => 'user',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
            ]
        ]);
        exit;
    }
}

// --- Invalid Credentials ---
http_response_code(401);
echo json_encode([
    'success' => false,
    'message' => 'Invalid login credentials'
]);
?>
