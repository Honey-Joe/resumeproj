<?php
// visit-counter.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://resumebuilder.freewilltech.in');
header('Access-Control-Allow-Credentials: true');

$file = dirname(__FILE__) . '/visit-count.txt';
$shouldIncrement = false;

// Check if request comes from your specific URL
if (isset($_SERVER['HTTP_REFERER']) && 
    parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) === 'resumebuilder.freewilltech.in') {
    $shouldIncrement = true;
}

// Initialize counter if needed
if (!file_exists($file)) {
    file_put_contents($file, '0');
}

// Read current count
$count = (int)file_get_contents($file);

// Increment if valid request
if ($shouldIncrement) {
    $count++;
    file_put_contents($file, $count);
    $updated = true;
} else {
    $updated = false;
}

echo json_encode([
    'count' => $count,
    'updated' => $updated
]);
?>