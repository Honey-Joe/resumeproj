<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'db.php'; // Uses MySQLi connection $conn

$key_secret = "EfGk4pOXcIRG9CUCjLRlxSXJ";

// Get raw POST body
$input = json_decode(file_get_contents("php://input"), true);

if (
    !$input ||
    !isset($input['razorpay_order_id'], $input['razorpay_payment_id'], $input['razorpay_signature'], $input['templateId'], $input['email'])
) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$razorpay_order_id = $input['razorpay_order_id'];
$razorpay_payment_id = $input['razorpay_payment_id'];
$razorpay_signature = $input['razorpay_signature'];
$templateId = $input['templateId'];
$email = $input['email']; // Use email instead of userId

// Signature verification
$generated_signature = hash_hmac('sha256', $razorpay_order_id . "|" . $razorpay_payment_id, $key_secret);

if (!hash_equals($generated_signature, $razorpay_signature)) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Signature mismatch"]);
    exit;
}

// Get user ID from email
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

// Check if already unlocked
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM unlocked_templates WHERE user_id = ? AND template_id = ?");
$stmt->bind_param("is", $userId, $templateId);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($result['count'] > 0) {
    echo json_encode([
        "status" => "success",
        "message" => "Template already unlocked",
        "templateId" => $templateId
    ]);
    exit;
}

// Insert record
$stmt = $conn->prepare("INSERT INTO unlocked_templates (user_id, template_id, payment_id, created_at) VALUES (?, ?, ?, NOW())");
$stmt->bind_param("iss", $userId, $templateId, $razorpay_payment_id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Payment verified and template unlocked",
        "templateId" => $templateId
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "DB error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>