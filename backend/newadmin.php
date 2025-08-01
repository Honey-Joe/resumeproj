<?php
include 'db.php';

$username = 'admin10';
$plainPassword = 'admin1235'; // Change this securely

// Check if the username already exists
$checkStmt = $conn->prepare("SELECT id FROM admins WHERE username = ?");
$checkStmt->bind_param("s", $username);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Admin already exists with this username.'
    ]);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Hash the password
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// Insert the new admin
$insertStmt = $conn->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
$insertStmt->bind_param("ss", $username, $hashedPassword);

if ($insertStmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Admin inserted successfully!',
        'admin' => $username
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to insert admin: ' . $insertStmt->error
    ]);
}

$insertStmt->close();
$conn->close();
?>
