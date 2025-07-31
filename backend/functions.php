<?php
// functions.php
require_once 'vendor/autoload.php'; // Include Composer autoload
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function generateJWT($user_id, $role = 'user') {
    $issuedAt = time();
    $expirationTime = $issuedAt + (60 * 60 * 24); // Valid for 1 day
    
    $payload = [
        'iat' => $issuedAt,
        'exp' => $expirationTime,
        'sub' => $user_id,
        'role' => $role
    ];
    
    return JWT::encode($payload, SECRET_KEY, 'HS256');
}

function validateJWT($token) {
    try {
        $decoded = JWT::decode($token, new Key(SECRET_KEY, 'HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        return false;
    }
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}