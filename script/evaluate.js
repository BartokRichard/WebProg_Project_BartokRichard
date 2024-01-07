$(document).ready(function() {
    $.ajax({
        url: 'evaluation.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.error) {
                console.error(response.error);
            } else {
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
        var correctAnswersCount = 0; 
    
        data.forEach(function(item) {
            var rowClass = item.resultClass;
    
            if (item.resultText === 'Correct') {
                correctAnswersCount++;
                rowClass += ' correct-answer-row'; 
            }
    
            var row = '<tr class="' + rowClass + '">';
            row += '<td>' + item.question + '</td>';
            row += '<td>' + item.correctAnswer + '</td>';
            row += '<td>' + item.userAnswer + '</td>';
            row += '<td>' + item.resultText + '</td>';
            row += '</tr>';
    
            tbody.append(row);
        });
    
        var totalRow = '<tr class="is-info">';
        totalRow += '<td colspan="3" class="has-text-centered"><strong>Total Correct Answers:</strong></td>';
        totalRow += '<td>' + correctAnswersCount + '</td>';
        totalRow += '</tr>';
    
        tbody.append(totalRow);
    }
    
});
