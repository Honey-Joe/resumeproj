<?php
require_once './db.php';
if ($conn) {
    echo "✅ Database connected!";
} else {
    echo "❌ Connection failed!";
}
?>
