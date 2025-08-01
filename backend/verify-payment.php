<?php
// === CORS Headers with Strict Origin Validation ===
// $allowed_origins = [
//     'https://resumebuilder.freewilltech.in',
//     'https://resumebuilder.freewilltech.in/builder'
// ];

// $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
// if (in_array($origin, $allowed_origins)) {
//     header("Access-Control-Allow-Origin: $origin");
// } else {
//     http_response_code(403);
//     echo json_encode(["status" => "error", "message" => "Origin not allowed"]);
//     exit;
// }


    header("Access-Control-Allow-Origin: *");


header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// === OPTIONS request ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// === DB connection ===
require_once 'db.php'; // $conn defined here

// === Razorpay Secret Key (from environment variable) ===
$key_secret = "EfGk4pOXcIRG9CUCjLRlxSXJ";
if (!$key_secret) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server misconfiguration"]);
    exit;
}

// === Read JSON Payload ===
$input = json_decode(file_get_contents("php://input"), true);

if (
    !$input ||
    !isset(
        $input['razorpay_order_id'],
        $input['razorpay_payment_id'],
        $input['razorpay_signature'],
        $input['templateId'],
        $input['email']
    )
) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

// === Extract and Sanitize Data ===
$razorpay_order_id = $input['razorpay_order_id'];
$razorpay_payment_id = $input['razorpay_payment_id'];
$razorpay_signature = $input['razorpay_signature'];
$templateId = filter_var($input['templateId'], FILTER_SANITIZE_STRING);
$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email"]);
    exit;
}

// === Verify Signature ===
$generated_signature = hash_hmac('sha256', $razorpay_order_id . "|" . $razorpay_payment_id, $key_secret);

if (!hash_equals($generated_signature, $razorpay_signature)) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Signature mismatch"]);
    exit;
}

// === Get User ID by Email ===
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result ? $result->fetch_assoc() : null;
$stmt->close();

if (!$user) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$userId = $user['id'];

// === Check if template already unlocked ===
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM unlocked_templates WHERE user_id = ? AND template_id = ?");
$stmt->bind_param("is", $userId, $templateId);
$stmt->execute();
$res = $stmt->get_result();
$countData = $res ? $res->fetch_assoc() : null;
$stmt->close();

if ($countData && $countData['count'] > 0) {
    echo json_encode([
        "status" => "success",
        "message" => "Template already unlocked",
        "templateId" => $templateId
    ]);
    exit;
}

// === Insert unlocked template ===
$stmt = $conn->prepare("INSERT INTO unlocked_templates (user_id, template_id, payment_id, created_at) VALUES (?, ?, ?, NOW())");
$stmt->bind_param("iss", $userId, $templateId, $razorpay_payment_id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Payment verified and template unlocked",
        "templateId" => $templateId
    ]);
} else {
    error_log("DB Insert Error: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
}

$stmt->close();
$conn->close();
?>
