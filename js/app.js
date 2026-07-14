let currentQuestion = 0;
const bootMessages = [
    "Initializing neural scanner...", "Loading personality engine...",
    "Reading behavioral matrix...", "Preparing psychological profile...", "System Ready."
];

window.onload = () => { bootSequence(); };

function bootSequence() {
    let i = 0;
    const log = document.getElementById("bootLog");
    const bar = document.getElementById("bootProgress");
    const timer = setInterval(() => {
        log.innerHTML += bootMessages[i] + "<br>";
        bar.style.width = ((i + 1) / bootMessages.length) * 100 + "%";
        i++;
        if (i === bootMessages.length) { clearInterval(timer); setTimeout(showIntro, 700); }
    }, 900);
}

function showIntro() {
    document.getElementById("bootScreen").classList.remove("active");
    document.getElementById("introScreen").classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const start = document.getElementById("startButton");
    if (start) start.onclick = startQuiz;
});

function startQuiz() {
    resetTraits();
    currentQuestion = 0;
    document.getElementById("introScreen").classList.remove("active");
    document.getElementById("quizScreen").classList.add("active");
    loadQuestion();
}

function loadQuestion() {
    const q = QUESTIONS[currentQuestion];
    document.getElementById("questionNumber").textContent = currentQuestion + 1;
    document.getElementById("questionText").textContent = q.text;
    const answers = document.getElementById("answers");
    answers.innerHTML = "";
    q.answers.forEach(answer => {
        const btn = document.createElement("div");
        btn.className = "answer";
        btn.textContent = answer.text;
        btn.onclick = () => selectAnswer(answer);
        answers.appendChild(btn);
    });
    const progress = Math.min((currentQuestion / QUESTIONS.length) * 100, 100);
    document.getElementById("quizProgress").style.width = progress + "%";
    document.getElementById("percentComplete").textContent = Math.round(progress) + "%";
}

function selectAnswer(answer) {
    applyAnswer(answer);
    currentQuestion++;
    const progress = Math.min((currentQuestion / QUESTIONS.length) * 100, 100);
    const progBar = document.getElementById("quizProgress");
    const progText = document.getElementById("percentComplete");
    if (progBar) progBar.style.width = progress + "%";
    if (progText) progText.textContent = Math.round(progress) + "%";
    
    if (currentQuestion >= QUESTIONS.length) { finishQuiz(); } 
    else { loadQuestion(); }
}