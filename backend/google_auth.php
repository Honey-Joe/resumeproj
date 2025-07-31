<?php
header("Content-Type: application/json");
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || !$data->email || !$data->name || !$data->googleId) {
  echo json_encode(['success' => false, 'message' => 'Invalid Google data']);
  exit;
}

$email = $conn->real_escape_string($data->email);
$name = $conn->real_escape_string($data->name);

// Check if user already exists
$check = $conn->query("SELECT id FROM users WHERE email = '$email'");
if ($check->num_rows === 0) {
  $conn->query("INSERT INTO users (name, email, password, age, role) VALUES ('$name', '$email', '', 0, 'google')");
}

echo json_encode(['success' => true, 'token' => uniqid('token_', true)]);
?>
