<?php
session_start();

class Logout {
    public function logoutUser() {
        session_unset();
        session_destroy();
        return json_encode(['status' => 'success', 'message' => 'Sikeres kijelentkezés']);
    }
}

$logout = new Logout();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo $logout->logoutUser();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Érvénytelen kérés.']);
}
?>
