<?php
session_start();

include 'db/db_con.php';

class Evaluation {
    public function evaluateQuiz($userId, $conn) {
        $sql = "SELECT * FROM questions WHERE user_id = $userId AND quiz_number = (SELECT MAX(quiz_number) FROM questions WHERE user_id = $userId)";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $quizData = array();

            while ($row = $result->fetch_assoc()) {
                $question = $row['question'];
                $correctAnswer = $row['correct_answer'];
                $userAnswer = $row['user_answer'];

                $resultClass = ($userAnswer === $correctAnswer) ? 'is-success' : 'is-danger';
                $resultText = ($userAnswer === $correctAnswer) ? 'Correct' : 'Incorrect';

                $quizData[] = array(
                    'question' => $question,
                    'correctAnswer' => $correctAnswer,
                    'userAnswer' => $userAnswer,
                    'resultClass' => $resultClass,
                    'resultText' => $resultText
                );
            }

            return json_encode($quizData);
        } else {
            return json_encode(array('error' => 'No questions found for user ' . $userId));
        }
    }
}

$evaluation = new Evaluation();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];

        echo $evaluation->evaluateQuiz($userId, $conn);
    } else {
        echo json_encode(array('error' => 'User not logged in'));
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Érvénytelen kérés.']);
}
?>
