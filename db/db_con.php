<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quiz_app";

// Adatbázis kapcsolat létrehozása
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
} else {
    // Sikeres kapcsolat esetén visszatérhetünk az $conn változóval
    return $conn;
}
?>
