const startScreen = document.querySelector(".start-screen");
const startButton = document.getElementById("start-btn");
const quizContainer = document.querySelector(".app");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const timerElement = document.getElementById("timer-display");
const backgroundAudio = document.getElementById("background-audio");

const howToPlayButton = document.getElementById("how-to-play-btn");
const instructions = "Cara Bermain:\n1. Anda akan diberi 20 pertanyaan seputar Indonesia.\n2. Pilihlah jawaban yang menurut Anda benar.\n3. Anda hanya diberikan waktu 2 menit.\n4. Setelah menjawab, klik tombol 'Lanjut'.\n5. Skor akan dihitung berdasarkan jumlah jawaban yang benar.\n6. Jika waktu habis sebelum Anda selesai, skor Anda tidak akan dihitung.\n7. Selamat bermain! @jehudavd 🥳";

howToPlayButton.addEventListener("click", () => {
    alert(instructions);
});

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let interval; 

const timerDuration = 120; 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

fetch("questions.json")
    .then(response => response.json())
    .then(loadedQuestions => {
        questions = loadedQuestions;
        shuffleArray(questions); 
    });

const muteButton = document.getElementById("mute-btn");

let isAudioMuted = false;

muteButton.addEventListener("click", toggleAudioMute);

function toggleAudioMute() {
    if (isAudioMuted) {
        backgroundAudio.play();
        isAudioMuted = false;
        muteButton.innerHTML = "Nyala";
        muteButton.classList.remove("muted");
        muteButton.classList.add("unmuted");
    } else {
        backgroundAudio.pause();
        isAudioMuted = true;
        muteButton.innerHTML = "Mati";
        muteButton.classList.remove("unmuted");
        muteButton.classList.add("muted");
    }
}


function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Lanjut";
    startScreen.style.display = "none";
    quizContainer.style.display = "block";
    showQuestion();
    startTimer(timerDuration, timerElement); 
}

function startTimer(duration, display) {
    let timer = duration;
    interval = setInterval(() => {
        display.textContent = timer;
        timer--;

        if (timer < 0) {
            clearInterval(interval);
            showTimeUpMessage();
        }
    }, 1000);
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    clearInterval(interval);
    resetState();
    questionElement.innerHTML = `Selamat skor kamu ${score} dari ${questions.length}!`;
    nextButton.innerHTML = "Selesai";
    nextButton.style.display = "block";
    nextButton.removeEventListener("click", handleNextButton);
    nextButton.addEventListener("click", () => {
        refreshPage();
    });
}

function showTimeUpMessage() {
    clearInterval(interval); 
    resetState();
    questionElement.textContent = "Maaf waktu habis, anda kurang gesit.";
    nextButton.innerHTML = "Selesai";
    nextButton.style.display = "block";
    nextButton.removeEventListener("click", handleNextButton);
    nextButton.addEventListener("click", () => {
        quizContainer.style.display="none";
        refreshPage(); 
    });
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        refreshPage(); 
    }
});

function refreshPage() {
    window.location.reload();
}

function playBackgroundAudio() {
    backgroundAudio.play();
}

quizContainer.style.display = "none"; 
startButton.addEventListener("click", () => {
    startQuiz();
    playBackgroundAudio(); 
});
