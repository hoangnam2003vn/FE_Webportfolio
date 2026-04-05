// Quiz Data
const quizData = [
    {
        question: "Ngôn ngữ lập trình nào dùng để phát triển Flutter?",
        options: ["A. Dart", "B. Java", "C. Kotlin", "D. Swift"],
        correctAnswer: 0
    },
    {
        question: "Framework nào phổ biến nhất cho Frontend hiện nay?",
        options: ["A. Angular", "B. React", "C. Vue", "D. Svelte"],
        correctAnswer: 1
    },
    {
        question: "Công cụ nào dùng để quản lý phiên bản?",
        options: ["A. Docker", "B. Jenkins", "C. Git", "D. Figma"],
        correctAnswer: 2
    },
    {
        question: "Docker dùng để làm gì?",
        options: ["A. Container hóa ứng dụng", "B. Quản lý database", "C. Viết code", "D. Thiết kế UI"],
        correctAnswer: 0
    },
    {
        question: "CI/CD là viết tắt của?",
        options: [
            "A. Code Import/Control Document",
            "B. Centralized Interface",
            "C. Computer Integrated Development",
            "D. Continuous Integration / Continuous Deployment"
        ],
        correctAnswer: 3
    }
];

let userAnswers = [null, null, null, null, null];

// Initialize Quiz
function initQuiz() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    quizData.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
            <div class="question-number">${index + 1}</div>
            <div class="question-text">${question.question}</div>
            <div class="options">
                ${question.options.map((option, optIndex) => `
                    <label class="option" onclick="selectAnswer(${index}, ${optIndex})">
                        <input type="radio" name="question-${index}" value="${optIndex}" id="option-${index}-${optIndex}">
                        <span class="option-label">${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(questionCard);
    });
}

// Select Answer
function selectAnswer(questionIndex, optionIndex) {
    userAnswers[questionIndex] = optionIndex;
    updateProgress();
    updateOptionSelection(questionIndex);
}

// Update Option Selection Display
function updateOptionSelection(questionIndex) {
    const options = document.querySelectorAll(`input[name="question-${questionIndex}"]`);
    options.forEach((option, index) => {
        const label = option.closest('.option');
        if (index === userAnswers[questionIndex]) {
            label.classList.add('selected');
            option.checked = true;
        } else {
            label.classList.remove('selected');
            option.checked = false;
        }
    });
}

// Update Progress
function updateProgress() {
    const answered = userAnswers.filter(answer => answer !== null).length;
    document.getElementById('progressCount').textContent = answered;
    document.getElementById('progressFill').style.width = (answered / 5) * 100 + '%';

    // Update button state
    const submitBtn = document.getElementById('submitBtn');
    if (answered === 5) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Submit Quiz
function submitQuiz() {
    const answered = userAnswers.filter(answer => answer !== null).length;
    
    if (answered < 5) {
        showNotification('Vui lòng trả lời đủ 5 câu hỏi trước khi nộp bài!');
        return;
    }

    // Calculate Score
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correctAnswer) {
            correctCount++;
        }
    });

    // Show Results
    displayResults(correctCount);
    document.getElementById('questionsContainer').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('retryBtn').style.display = 'inline-block';
}

// Display Results
function displayResults(score) {
    document.getElementById('scoreDisplay').textContent = `${score}/5`;
    
    let message = '';
    if (score === 5) {
        message = 'Xuất sắc! Bạn đã trả lời chính xác tất cả các câu hỏi!';
    } else if (score >= 4) {
        message = 'Rất tốt! Bạn chỉ sai một câu.';
    } else if (score >= 3) {
        message = 'Tốt! Bạn nắm vững hầu hết kiến thức.';
    } else if (score >= 2) {
        message = 'Bạn cần ôn tập thêm một chút.';
    } else {
        message = 'Hãy ôn tập lại và thử lại nhé!';
    }
    
    document.getElementById('resultMessage').textContent = message;

    // Generate Detail Results
    let detailsHTML = '';
    quizData.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.correctAnswer;
        const userAnswerText = question.options[userAnswers[index]];
        const correctAnswerText = question.options[question.correctAnswer];

        detailsHTML += `
            <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-question">Câu ${index + 1}: ${question.question}</div>
                <div class="result-answer">
                    <div class="result-answer-detail">
                        <span class="result-label">Đáp án đúng:</span>
                        <span class="correct-answer">${correctAnswerText}</span>
                    </div>
                    <div class="result-answer-detail">
                        <span class="result-label">Bạn chọn:</span>
                        <span class="user-answer ${isCorrect ? 'correct-text' : ''}">${userAnswerText}</span>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('resultDetails').innerHTML = detailsHTML;
    document.getElementById('resultsSection').classList.add('show');
}

// Retry Quiz
function retryQuiz() {
    userAnswers = [null, null, null, null, null];
    document.getElementById('progressCount').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('retryBtn').style.display = 'none';
    document.getElementById('resultsSection').classList.remove('show');
    document.getElementById('questionsContainer').style.display = 'flex';
    document.getElementById('notification').classList.remove('show');
    
    // Re-render all options
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });

    initQuiz();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
    document.getElementById('submitBtn').disabled = true;
});
