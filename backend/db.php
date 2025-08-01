<?php
$host = "localhost";
$user = "freewmbl_resume";
$pass = "resumebuilder123";
$db   = "freewmbl_resumebuild";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'DB connection failed',
        'error' => $conn->connect_error
    ]);
    exit;
}
?>
