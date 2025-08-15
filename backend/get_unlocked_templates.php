<?php
// ----------------------------
// 🌐 Allow all origins (CORS *)
// ----------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token, X-Requested-With");
header("Content-Type: application/json");

// ----------------------------
// ✅ Handle OPTIONS preflight
// ----------------------------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ----------------------------
// ✅ Include DB connection
// ----------------------------
require_once 'db.php';

// ----------------------------
// ✅ Token Extraction
// ----------------------------
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

$token = '';
if (!empty($authHeader) && preg_match('/Bearer\s(.+)/i', $authHeader, $matches)) {
    $token = trim($matches[1]);
}

// ----------------------------
// 🔐 Validate Token
// ----------------------------
if (empty($token)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Missing token"]);
    exit;
}

if ($token !== 'adminsecret') {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid token"]);
    exit;
}

// ----------------------------
// 📩 Get email from query
// ----------------------------
$email = $_GET['email'] ?? '';

if (empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing email"]);
    exit;
}

// ----------------------------
// 🔍 Get user ID from email
// ----------------------------
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$userId = $user['id'];

// ----------------------------
// 📤 Get unlocked templates
// ----------------------------
$stmt = $conn->prepare("SELECT id, template_id, created_at FROM unlocked_templates WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$templates = [];
while ($row = $result->fetch_assoc()) {
    $templates[] = [
        'id' => $row['id'],
        'name' => $row['template_id'],
        'unlocked_date' => $row['created_at']
    ];
}

$stmt->close();
$conn->close();

// ----------------------------
// ✅ Success Response
// ----------------------------
header('Content-Type: application/json');
echo json_encode([
    "status" => "success",
    "templates" => $templates
]);
