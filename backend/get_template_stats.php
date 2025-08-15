<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token, X-Requested-With");
header("Content-Type: application/json");

// ----------------------------
// ✅ Handle OPTIONS preflight
// ----------------------------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ----------------------------
// ✅ Include DB connection
// ----------------------------
require_once 'db.php';

// ----------------------------
// ✅ Improved Token Extraction
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
// ✅ Fetch template unlock stats
// ----------------------------
$query = "
    SELECT template_id, COUNT(*) AS unlock_count
    FROM unlocked_templates
    GROUP BY template_id
    ORDER BY unlock_count DESC
";

$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Query failed: " . $conn->error]);
    exit;
}

$stats = [];
while ($row = $result->fetch_assoc()) {
    $stats[] = [
        'template_id' => $row['template_id'],
        'unlock_count' => (int)$row['unlock_count']
    ];
}

$conn->close();

// ----------------------------
// ✅ Send success response
// ----------------------------
echo json_encode([
    "status" => "success",
    "stats" => $stats
]);
?>
