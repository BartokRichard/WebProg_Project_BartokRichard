<?php
session_start();

include 'db/db_con.php';

class ProcessQuestions {
    public function saveQuestions($questions, $correctAnswers, $userAnswers, $userId, $conn) {
        $query = "SELECT MAX(quiz_number) AS max_quiz_number FROM questions";
        $result = $conn->query($query);

        if ($result) {
            $row = $result->fetch_assoc();
            $maxQuizNumber = $row['max_quiz_number'];
            $quizNumber = $maxQuizNumber + 1;

            if (isset($_SESSION['user_id'])) {
                $userId = $_SESSION['user_id'];

                $stmt = $conn->prepare("INSERT INTO questions (quiz_number, question, correct_answer, user_id, user_answer) VALUES (?, ?, ?, ?, ?)");

                if ($stmt) {
                    for ($i = 0; $i < count($questions); $i++) {
                        $stmt->bind_param("issss", $quizNumber, $questions[$i], $correctAnswers[$i], $userId, $userAnswers[$i]);
                        if ($stmt->execute()) {
                            echo "Sikeresen beszúrva a kérdés: " . $questions[$i] . "<br>";
                        } else {
                            echo "Hiba a kérdés beszúrása során: " . $stmt->error . "<br>";
                        }
                    }
                } else {
                    echo "Hiányzó adatok érkeztek";
                }
            } else {
                echo "A felhasználó nincs bejelentkezve";
            }
        } else {
            echo "Hiba a quizNumber lekérdezése során: " . $conn->error . "<br>";
        }
    }
}

$processQuestions = new ProcessQuestions();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $questions = $_POST['questions'];
    $correctAnswers = $_POST['correctAnswers'];
    $userAnswers = $_POST['userAnswers'];

    echo $processQuestions->saveQuestions($questions, $correctAnswers, $userAnswers, $userId, $conn);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Érvénytelen kérés.']);
}
?>
