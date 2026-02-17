const questions = [
  { q: "2 + 2 = ?", options: ["3", "4", "5"], answer: "4" },
  { q: "Thủ đô của Việt Nam?", options: ["Hà Nội", "Đà Nẵng", "TP.HCM"], answer: "Hà Nội" },
  { q: "Màu của bầu trời?", options: ["Xanh", "Đỏ", "Vàng"], answer: "Xanh" },
];

let current = 0;
let score = 0;

const quizDiv = document.getElementById("quiz");
const resultDiv = document.getElementById("result");
const restartBtn = document.getElementById("restart");

function showQuestion() {
  quizDiv.innerHTML = "";
  const q = document.createElement("p");
  q.textContent = questions[current].q;
  quizDiv.appendChild(q);

  questions[current].options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    quizDiv.appendChild(btn);
  });
}

function checkAnswer(option) {
  if (option === questions[current].answer) {
    score++;
  }
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    quizDiv.innerHTML = "";
    resultDiv.innerHTML = `<h2>Bạn trả lời đúng ${score}/${questions.length} câu!</h2>`;

    // Gửi điểm lên backend
    fetch("http://localhost:4000/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Người chơi", score: score })
    }).then(() => loadLeaderboard());

    restartBtn.style.display = "inline-block";
  }
}

restartBtn.onclick = () => {
  current = 0;
  score = 0;
  resultDiv.innerHTML = "";
  restartBtn.style.display = "none";
  showQuestion();
};

// Hàm tải bảng xếp hạng
function loadLeaderboard() {
  fetch("https://maztermind.onrender.com")
    .then(res => res.json())
    .then(scores => {
      const list = document.getElementById("scoreList");
      list.innerHTML = "";
      scores.forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.name}: ${s.score} điểm`;
        list.appendChild(li);
      });
    });
}

// Gọi khi web khởi động
loadLeaderboard();
showQuestion();
