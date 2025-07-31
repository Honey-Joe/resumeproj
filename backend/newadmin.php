<?php
include 'db.php';

$username = 'admin1';
$plainPassword = 'admin123'; // You will login with this
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $hashedPassword);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Admin inserted successfully!";
} else {
    echo "Failed to insert admin.";
}
?>
