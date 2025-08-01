<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!function_exists('curl_init')) {
    echo json_encode(["status" => "error", "message" => "cURL not available on server"]);
    exit;
}

$key_id = "rzp_live_UwaASm36jyEsg4";
$key_secret = "EfGk4pOXcIRG9CUCjLRlxSXJ";

$input = json_decode(file_get_contents("php://input"), true);
$templateId = $input['templateId'] ?? null;
$email = $input['email'] ?? null; // Get email from request

if (!$templateId || !$email) {
    echo json_encode(["status" => "error", "message" => "Missing templateId or email"]);
    exit;
}

$amount = 5000; // ₹50 in paise
$receipt = "receipt_" . uniqid();

$data = [
    "amount" => $amount,
    "currency" => "INR",
    "receipt" => $receipt,
    "payment_capture" => 1,
    "notes" => [
        "template_id" => $templateId,
        "email" => $email
    ]
];

$ch = curl_init("https://api.razorpay.com/v1/orders");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, "$key_id:$key_secret");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // only for local/dev

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($http_status !== 200 || isset($result['error'])) {
    echo json_encode([
        "status" => "error",
        "message" => $result['error']['description'] ?? "Order creation failed",
        "debug" => $result // Add this for debugging
    ]);
    exit;
}


echo json_encode([
    "status" => "success",
    "order_id" => $result['id'],
    "amount" => $result['amount'],
    "currency" => $result['currency']
]);
?>