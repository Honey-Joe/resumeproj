<?php
$host = "localhost";
$user = "root";
$pass = "Nulr2025@00#";
$db   = "resumebuild";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check for connection errors
if ($conn->connect_error) {
    // Connection failed
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'DB connection failed',
        'error' => $conn->connect_error
    ]);
    exit;
}
?>
