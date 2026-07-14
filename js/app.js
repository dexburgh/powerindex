let currentQuestion = 0;
let quizMode = 'mid';
let quizQuestions = [];

const MODE_CONFIG = {
  short: { count: 15, label: 'SHORT SCAN', time: '~3 min' },
  mid:   { count: 30, label: 'DEEP SCAN', time: '~7 min' },
  full:  { count: 50, label: 'FULL INDEX', time: '~12 min' }
};

const bootMessages = [
    "Initializing neural scanner...",
    "Loading personality engine...",
    "Reading behavioral matrix...",
    "Preparing psychological profile...",
    "System Ready."
];

document.addEventListener("DOMContentLoaded", () => { init(); });

function init() {
    const restart = document.getElementById("restartButton");
    const download = document.getElementById("downloadButton");
    if (restart) restart.addEventListener("click", restartQuiz);
    if (download) download.addEventListener("click", downloadProfile);

    document.querySelectorAll(".mode-card").forEach(card => {
        card.addEventListener("click", () => {
            const mode = card.dataset.mode || 'mid';
            startQuiz(mode);
        });
    });

    bootSequence();
}

function bootSequence() {
    let i = 0;
    const log = document.getElementById("bootLog");
    const bar = document.getElementById("bootProgress");
    if (!log || !bar) { showIntro(); return; }
    log.innerHTML = "";
    bar.style.width = "0%";
    const timer = setInterval(() => {
        if (i < bootMessages.length) {
            log.innerHTML += bootMessages[i] + "<br>";
            bar.style.width = ((i + 1) / bootMessages.length) * 100 + "%";
            log.scrollTop = log.scrollHeight;
            i++;
        }
        if (i >= bootMessages.length) {
            clearInterval(timer);
            setTimeout(showIntro, 650);
        }
    }, 520);
}

function showIntro() { switchScreen("introScreen"); }

function startQuiz(mode = 'mid') {
    if (typeof QUESTIONS === 'undefined' || !QUESTIONS.length) {
        console.error("QUESTIONS not loaded");
        return;
    }
    quizMode = MODE_CONFIG[mode] ? mode : 'mid';
    const count = MODE_CONFIG[quizMode].count;
    quizQuestions = QUESTIONS.slice(0, count);

    if (typeof resetTraits === 'function') resetTraits();
    currentQuestion = 0;

    const totalEl = document.getElementById("questionTotal");
    const modeEl = document.getElementById("modeLabel");
    if (totalEl) totalEl.textContent = quizQuestions.length;
    if (modeEl) modeEl.textContent = `• ${MODE_CONFIG[quizMode].label}`;

    const meta = document.getElementById("analysisMeta");
    if (meta) meta.textContent = `Mode: ${MODE_CONFIG[quizMode].label} | Questions: ${count} | Engine: v2.4`;

    switchScreen("quizScreen");
    loadQuestion();
}

function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    if (!q) return;
    const numEl = document.getElementById("questionNumber");
    const textEl = document.getElementById("questionText");
    const answersEl = document.getElementById("answers");
    const progressEl = document.getElementById("quizProgress");
    const percentEl = document.getElementById("percentComplete");
    if (numEl) numEl.textContent = currentQuestion + 1;
    if (textEl) textEl.textContent = q.text;
    if (!answersEl) return;
    answersEl.innerHTML = "";
    q.answers.forEach((answer) => {
        const btn = document.createElement("button");
        btn.className = "answer";
        btn.type = "button";
        btn.textContent = answer.text;
        btn.addEventListener("click", () => selectAnswer(answer));
        answersEl.appendChild(btn);
    });
    const progress = (currentQuestion / quizQuestions.length) * 100;
    if (progressEl) progressEl.style.width = progress + "%";
    if (percentEl) percentEl.textContent = Math.round(progress) + "%";
}

function selectAnswer(answer) {
    if (typeof applyAnswer === 'function') applyAnswer(answer);
    currentQuestion++;
    const progress = Math.min((currentQuestion / quizQuestions.length) * 100, 100);
    const progBar = document.getElementById("quizProgress");
    const progText = document.getElementById("percentComplete");
    if (progBar) progBar.style.width = progress + "%";
    if (progText) progText.textContent = Math.round(progress) + "%";
    if (currentQuestion >= quizQuestions.length) { finishQuiz(); }
    else { setTimeout(loadQuestion, 120); }
}

function switchScreen(targetId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(targetId);
    if (target) target.classList.add("active");
}

function restartQuiz() {
    currentQuestion = 0;
    quizQuestions = [];
    if (typeof resetTraits === 'function') resetTraits();
    switchScreen("introScreen");
}

function downloadProfile() {
    try {
        const raw = localStorage.getItem('ARCHITECT_IDENTITY');
        if (!raw) { alert("No dossier found. Complete a scan first."); return; }
        const profile = JSON.parse(raw);
        const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${profile.hero.replace(/\s+/g,'_')}_${profile.mode || 'dossier'}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    } catch (e) { console.error("Download failed", e); }
}

// Allow engine to read current mode
function getCurrentMode() { return quizMode; }
function getQuizQuestions() { return quizQuestions; }
