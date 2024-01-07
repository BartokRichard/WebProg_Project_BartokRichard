<?php
session_start();

include 'db/db_con.php';

class Registration {
    public function registerUser($username, $password, $conn) {
        $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
        
        if ($conn->query($sql) === TRUE) {
            return json_encode(['status' => 'success', 'message' => 'Sikeres regisztráció']);
        } else {
            return json_encode(['status' => 'error', 'message' => 'Hiba a regisztráció során: ' . $conn->error]);
        }
    }   
}

$registration = new Registration();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    echo $registration->registerUser($username, $password, $conn);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Érvénytelen kérés.']);
}
?>
