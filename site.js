// Sample IELTS Reading Test Data
const sampleTestData = {
    title: "Reading Passage 1: The Future of Renewable Energy",
    passage: `
        <p>Renewable energy sources, such as solar, wind, and hydroelectric power, have become increasingly vital in the global effort to combat climate change. Over the past decade, technological advancements have significantly reduced the cost of generating electricity from these sustainable resources.</p>
        <p>Solar energy, in particular, has seen unprecedented growth. Photovoltaic panels have become more efficient, capturing a higher percentage of sunlight even on cloudy days. Meanwhile, offshore wind farms are harnessing stronger and more consistent ocean winds to supply power to millions of homes.</p>
        <p>Despite these advancements, energy storage remains a critical challenge. Because solar and wind power generation fluctuates based on weather conditions, developing high-capacity battery systems is essential to ensure a stable grid supply.</p>
    `,
    questions: [
        {
            id: 1,
            text: "What has reduced the cost of generating electricity from renewable sources?",
            options: [
                "Government taxes",
                "Technological advancements",
                "Decreased global demand",
                "Traditional fossil fuel expansion"
            ],
            correct: 1
        },
        {
            id: 2,
            text: "Which source of energy has experienced unprecedented growth?",
            options: [
                "Hydroelectric power",
                "Wind energy",
                "Solar energy",
                "Nuclear power"
            ],
            correct: 2
        },
        {
            id: 3,
            text: "What is currently identified as a critical challenge for renewable energy?",
            options: [
                "Energy storage",
                "High manufacturing costs",
                "Lack of public interest",
                "Ocean pollution"
            ],
            correct: 0
        }
    ]
};

// Application State
let currentState = {
    timeLeft: 3600, // 60 minutes in seconds
    currentQuestionIndex: 0,
    answers: {},
    reviewed: {},
    language: 'en',
    theme: 'light'
};

// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const langSelector = document.getElementById('lang-selector');
const highlightBtn = document.getElementById('btn-highlight');
const passageContent = document.getElementById('passage-content');
const questionsContent = document.getElementById('questions-content');
const questionPalette = document.getElementById('question-palette');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    startTimer();
    loadTestData(sampleTestData);
    setupEventListeners();
});

// Load Test Data into UI
function loadTestData(data) {
    document.getElementById('passage-title').innerText = data.title;
    passageContent.innerHTML = data.passage;

    // Render Questions
    questionsContent.innerHTML = '';
    questionPalette.innerHTML = '';

    data.questions.forEach((q, index) => {
        // Question Card
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `q-card-${index}`;

        const qTitle = document.createElement('div');
        qTitle.className = 'question-title';
        qTitle.innerText = `Q${index + 1}. ${q.text}`;
        card.appendChild(qTitle);

        const optionsGroup = document.createElement('div');
        optionsGroup.className = 'options-group';

        q.options.forEach((opt, optIdx) => {
            const label = document.createElement('label');
            label.className = 'option-item';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `question-${index}`;
            radio.value = optIdx;
            radio.addEventListener('change', () => selectAnswer(index, optIdx));

            label.appendChild(radio);
            label.appendChild(document.createTextNode(` ${opt}`));
            optionsGroup.appendChild(label);
        });

        card.appendChild(optionsGroup);
        questionsContent.appendChild(card);

        // Palette Button
        const pBtn = document.createElement('button');
        pBtn.className = 'q-btn';
        pBtn.id = `palette-btn-${index}`;
        pBtn.innerText = index + 1;
        pBtn.addEventListener('click', () => scrollToQuestion(index));
        questionPalette.appendChild(pBtn);
    });
}

// Answer Selection Handler
function selectAnswer(qIndex, optionIndex) {
    currentState.answers[qIndex] = optionIndex;
    const pBtn = document.getElementById(`palette-btn-${qIndex}`);
    if (pBtn) pBtn.classList.add('answered');
}

// Timer Logic
function startTimer() {
    const timerInterval = setInterval(() => {
        if (currentState.timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting test...");
            submitTest();
            return;
        }
        currentState.timeLeft--;
        const mins = Math.floor(currentState.timeLeft / 60);
        const secs = currentState.timeLeft % 60;
        timerDisplay.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

// Highlight Selected Text Feature
highlightBtn.addEventListener('click', () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'highlighted';
    range.surroundContents(span);
});

// Dark/Light Theme Switcher
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentState.theme = theme;
    localStorage.setItem('theme', theme);
    themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

themeToggleBtn.addEventListener('click', () => {
    setTheme(currentState.theme === 'light' ? 'dark' : 'light');
});

// Scroll To Specific Question
function scrollToQuestion(index) {
    const card = document.getElementById(`q-card-${index}`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
    }
}

// Submit Test Logic
function submitTest() {
    let score = 0;
    sampleTestData.questions.forEach((q, idx) => {
        if (currentState.answers[idx] === q.correct) {
            score++;
        }
    });
    alert(`Test Finished!\nYour Score: ${score} / ${sampleTestData.questions.length}`);
}

document.getElementById('btn-submit').addEventListener('click', () => {
    if (confirm("Are you sure you want to submit your test?")) {
        submitTest();
    }
});
