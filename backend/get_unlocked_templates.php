<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include DB connection
require_once 'db.php';

$email = isset($_GET['email']) ? trim($_GET['email']) : '';

if (empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email is required"]);
    exit;
}

// Get user ID by email
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$userId = $user['id'];

// Fetch unlocked templates for this user
$stmt = $conn->prepare("SELECT template_id FROM unlocked_templates WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$templates = [];
while ($row = $result->fetch_assoc()) {
    $templates[] = $row['template_id'];
}
$stmt->close();
$conn->close();

echo json_encode(["status" => "success", "templates" => $templates]);
?>