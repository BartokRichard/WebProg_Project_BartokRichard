$(document).ready(function() {
    // AJAX hívás az evaluation.php fájlhoz
    $.ajax({
        url: 'evaluation.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // Kezeld a JSON választ itt, például az értékelési táblázat frissítése
            if (response.error) {
                console.error(response.error);
            } else {
                // Frissítsd a táblázatot az értékelési adatokkal
                updateEvaluationTable(response);
            }
        },
        error: function(error) {
            console.error('AJAX error:', error);
        }
    });

    function updateEvaluationTable(data) {
        // Frissítsd a táblázatot az értékelési adatokkal
        var tbody = $('#evaluation-table-body');
        var correctAnswersCount = 0; // Count of correct answers
    
        data.forEach(function(item) {
            var rowClass = item.resultClass;
    
            // If the answer is correct, add a special class for highlighting
            if (item.resultText === 'Correct') {
                correctAnswersCount++;
                rowClass += ' correct-answer-row'; // Add a custom class for highlighting correct answers
            }
    
            var row = '<tr class="' + rowClass + '">';
            row += '<td>' + item.question + '</td>';
            row += '<td>' + item.correctAnswer + '</td>';
            row += '<td>' + item.userAnswer + '</td>';
            row += '<td>' + item.resultText + '</td>';
            row += '</tr>';
    
            tbody.append(row);
        });
    
        // Add a row at the end displaying the total number of correct answers
        var totalRow = '<tr class="is-info">';
        totalRow += '<td colspan="3" class="has-text-centered"><strong>Total Correct Answers:</strong></td>';
        totalRow += '<td>' + correctAnswersCount + '</td>';
        totalRow += '</tr>';
    
        tbody.append(totalRow);
    }
    
});
