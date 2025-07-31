<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Development error reporting (disable on production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db.php';

// Decode incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$email = trim($data['email'] ?? '');
$templateId = trim($data['template_id'] ?? '');

if (empty($email) || empty($templateId)) {
    echo json_encode(["status" => "error", "message" => "Missing email or template_id"]);
    exit;
}

// Step 1: Get user ID based on email
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

$userId = intval($user['id']);

// Step 2: Insert into unlocked_templates table
$stmt = $conn->prepare("INSERT IGNORE INTO unlocked_templates (user_id, template_id) VALUES (?, ?)");
$stmt->bind_param("is", $userId, $templateId);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Template unlocked successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
