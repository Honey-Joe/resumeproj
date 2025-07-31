<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database configuration
$servername = "localhost";
$username = "root";
$password = "Nulr2025@00#";
$dbname = "resume_builder";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Prepare response
$response = ['success' => false, 'error' => ''];

try {
    // Start transaction
    $conn->begin_transaction();

    // Insert personal information
    $stmt = $conn->prepare("INSERT INTO resumes (name, title, email, phone, location, summary) VALUES (?, ?, ?, ?, ?, ?)");
    $personal = $data['personal'];
    $stmt->bind_param("ssssss", 
        $personal['name'],
        $personal['title'],
        $personal['email'],
        $personal['phone'],
        $personal['location'],
        $personal['summary']
    );
    $stmt->execute();
    $resume_id = $conn->insert_id;
    $stmt->close();

    // Insert education
    if (!empty($data['education'])) {
        $stmt = $conn->prepare("INSERT INTO education (resume_id, institution, degree, year, description) VALUES (?, ?, ?, ?, ?)");
        foreach ($data['education'] as $edu) {
            if (!empty($edu['institution'])) {
                $stmt->bind_param("issss", $resume_id, $edu['institution'], $edu['degree'], $edu['year'], $edu['description']);
                $stmt->execute();
            }
        }
        $stmt->close();
    }

    // Insert experience
    if (!empty($data['experience'])) {
        $stmt = $conn->prepare("INSERT INTO experience (resume_id, company, position, start_date, end_date, responsibilities) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($data['experience'] as $exp) {
            if (!empty($exp['company'])) {
                $stmt->bind_param("isssss", $resume_id, $exp['company'], $exp['position'], $exp['start'], $exp['end'], $exp['responsibilities']);
                $stmt->execute();
            }
        }
        $stmt->close();
    }

    // Insert skills
    if (!empty($data['skills'])) {
        $stmt = $conn->prepare("INSERT INTO skills (resume_id, skill_name, proficiency) VALUES (?, ?, ?)");
        foreach ($data['skills'] as $skill) {
            if (!empty($skill['name'])) {
                $proficiency = $skill['level'] ?? 80;
                $stmt->bind_param("isi", $resume_id, $skill['name'], $proficiency);
                $stmt->execute();
            }
        }
        $stmt->close();
    }

    // Commit transaction
    $conn->commit();
    $response = ['success' => true, 'resume_id' => $resume_id];
} catch (Exception $e) {
    $conn->rollback();
    $response['error'] = 'Database error: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>