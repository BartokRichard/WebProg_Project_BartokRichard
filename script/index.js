$(document).ready(function () {
    const apiUrl = "https://opentdb.com/api.php?amount=20&category=";
    let categories = new Set();
    let quizNumber = 0;
    let userId = 0;
    let userName = '';
    let currentSlide = 0;
    let data; 
    function loadQuestionsByCategory(selectedCategory) {
        const finalApiUrl = selectedCategory === 'all' ? apiUrl : apiUrl + selectedCategory;

        $.ajax({
            url: finalApiUrl,
            method: 'GET',
            success: function (responseData) {
                data = responseData; 
                const cardContainer = $('#card_container');
                const slidesContainer = $('<div>').addClass('slides-container');

                const cards = [];

                data.results.forEach((result, index) => {
                    const card = createQuizCard(result);
                    cards.push(card);
                });

            
                const rows = chunkArray(cards, 4);

                rows.forEach((row, index) => {
                    const slide = $('<div>').addClass('slide').append(row);
                    slidesContainer.append(slide);
                });

                const totalSlides = rows.length;

                const prevButton = $('#prevPage');
                const nextButton = $('#nextPage');

                prevButton.on('click', function () {
                    showSlide(currentSlide - 1);
                });

                nextButton.on('click', function () {
                    showSlide(currentSlide + 1);
                });

                cardContainer.html(slidesContainer);

                showSlide(0);
            },
            error: function (error) {
                console.error('Fetch error:', error);
            }
        });

        function showSlide(index) {
            const slides = $('.slides-container .slide');
            const totalSlides = slides.length;
        
            if (index < 0) {
                index = totalSlides - 1;
            } else if (index >= totalSlides) {
                index = 0;
            }
        
            slides.hide();
            slides.eq(index).show();
        
            currentSlide = index;
        
            // A kérdések sorszámának kiszámítása
            const questionsPerPage = 4;
            const currentQuestionNumber = index * questionsPerPage + 1;
            const totalQuestions = data.results.length;
        
            const questionsInCurrentSlide = Math.min(questionsPerPage, totalQuestions - currentQuestionNumber + 1);
            const lastQuestionInCurrentSlide = currentQuestionNumber + questionsInCurrentSlide - 1;
        

            const counterText = `Questions: ${lastQuestionInCurrentSlide}/${totalQuestions}`;
            $('#questionCounter').text(counterText);
        }
        
    }

    function handlePageLoad() {
        if (quizNumber === 0) {
            quizNumber++;
            $('#initialQuizNumber').val(quizNumber);
        }
    }

    function fillDropdown(categories) {
        const select = $('.select select');
        select.append($('<option>').val('all').text('All Category'));
        categories.forEach(category => {
            const option = $('<option>').val(category.id).text(category.name);
            select.append(option);
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getCorrectAnswer(quizCard) {
        const correctRadio = quizCard.find('.answers input[data-correct="true"]');
        return correctRadio.next('span').text();
    }

    function createQuizCard(question) {
        const quizCard = $('<div>').addClass('column is-3 quiz-card');
        const questionDiv = $('<div>').addClass('question');
        const questionHeader = $('<h2>').html(question.question);
        questionDiv.append(questionHeader);
        quizCard.append(questionDiv);

        const answersDiv = $('<div>').addClass('answers');

        const correctAnswer = question.correct_answer.trim();
        const answers = shuffle([...question.incorrect_answers, correctAnswer]);

        answers.forEach(answer => {
            const label = $('<label>').addClass('answer');
            const input = $('<input>').attr('type', 'radio').attr('name', question.question).addClass('answer-radio');

            if (answer === correctAnswer) {
                input.attr('data-correct', 'true');
            }

            const answerText = $('<span>').html(answer);
            label.append(input).append(answerText);
            answersDiv.append(label);
        });

        quizCard.append(answersDiv);

        return quizCard;
    }

    function chunkArray(array, chunkSize) {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    }

    $.ajax({
        url: "https://opentdb.com/api_category.php",
        method: 'GET',
        success: function(data) {
            data.trivia_categories.forEach(category => {
                categories.add({ id: category.id, name: category.name });
            });
            fillDropdown(categories);
            loadQuestionsByCategory('all');
        },
        error: function(error) {
            console.error('Fetch error:', error);
        }
    });

    handlePageLoad();

    $('.select select').on('change', function() {
        const selectedCategory = $(this).val();
        if (selectedCategory !== 'all') {
            quizNumber = 1; 
        }
        loadQuestionsByCategory(selectedCategory);
    });

    const loggedInUserName = localStorage.getItem('username');
    if (loggedInUserName) {
        userName = loggedInUserName;
    }

    function createNotification() {
        var notification = document.createElement('div');
        notification.className = 'notification is-success';
        notification.style.textAlign = 'center';
        notification.style.fontWeight = 'bold';
        notification.style.backgroundColor = '#3f8720';

        var contentContainer = document.createElement('div');
        contentContainer.className = 'content-container centered-content';

        var message = document.createElement('strong');
        message.innerText = 'Your answers have been submitted!';
        contentContainer.appendChild(message);

        var redirectButton = document.createElement('button');
        redirectButton.className = 'button is-info';
        redirectButton.innerText = 'Go to Quiz Evaluation';
        redirectButton.id = 'quizEvaluationButton';

        setTimeout(function() {
            var redirectButton = document.getElementById('quizEvaluationButton');
            console.log(redirectButton);
            redirectButton.addEventListener('click', function() {
                window.location.href = 'quizEvaluation.html';
                console.log("click");
            });
        }, 100);

        contentContainer.appendChild(redirectButton);
        notification.appendChild(contentContainer);
        notification.innerHTML += '<button class="delete"></button>';

        notification.querySelector('.delete').addEventListener('click', function() {
            notification.remove();
        });

        return notification;
    }

    $('#submitBtn').on('click', function() {
        const questions = [];
        const correctAnswers = [];
        const userAnswers = [];

        $('.quiz-card').each(function() {
            const question = $(this).find('.question h2').text();
            const correctAnswer = getCorrectAnswer($(this));
            const userAnswer = $(this).find('.answers input[type="radio"]:checked + span').text();

            questions.push(question);
            correctAnswers.push(correctAnswer);
            userAnswers.push(userAnswer);
        });

        $.ajax({
            url: 'processQuestions.php',
            method: 'POST',
            data: {
                questions: questions,
                correctAnswers: correctAnswers,
                userAnswers: userAnswers,
                user_id: userId,
                user_name: userName
            },
            success: function(response) {
                console.log(response);
                var notification = createNotification();
                document.getElementById('messageContainer').appendChild(notification);
            },
            error: function(error) {
                console.error('Hiba a feltöltéskor:', error);
                var notification = createNotification();
                notification.className = 'notification is-danger';
                document.getElementById('messageContainer').appendChild(notification);
            }
        });
    });
});
