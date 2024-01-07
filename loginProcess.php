<?php
session_start();

include 'db/db_con.php';

class Login {
    public function processLogin($username, $password) {
        global $conn;

        $sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
        $result = $conn->query($sql);

        // Minden bejelentkezési kísérlet előtt töröljük az összes előző hibaüzenetet
        unset($_SESSION['error_messages']);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $user_id = $row['user_id'];
            $username = $row['username']; 

            $_SESSION['user_id'] = $user_id;
            
            return json_encode(['status' => 'success', 'redirect' => 'index.html']);
        } else {
            // Sikertelen bejelentkezés esetén csak az utolsó hibaüzenetet tároljuk el
            $_SESSION['error_messages'][] = "Hibás felhasználónév vagy jelszó";
            return json_encode(['status' => 'error', 'message' => end($_SESSION['error_messages'])]);
        }
    }
}

$login = new Login();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    echo $login->processLogin($username, $password);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Érvénytelen kérés.']);
}
?>
