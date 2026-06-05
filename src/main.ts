import "./style.css";

type Card = {
  id: number;
  kanji: string;
  reading: string;
  en: string;
  th: string;
  example_kanji: string;
  example_kana: string;
  example_en: string;
  example_th: string;
};

type QuizMode = "jp-to-meaning" | "meaning-to-jp" | "reading-to-jp";

let originalDeck: Card[] = [];
let current: Card | null = null;

let quizMode: QuizMode = "jp-to-meaning";

let decks: Record<QuizMode, Card[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};

let guessedByMode: Record<QuizMode, Card[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};

const question = document.getElementById("question")!;
const answer = document.getElementById("answer")!;
const guessedCount = document.getElementById("guessedCount")!;
const guessedList = document.getElementById("guessedList")!;
const remainCount = document.getElementById("remainCount")!;
const historyToggleBtn = document.getElementById("historyToggleBtn") as HTMLButtonElement;
// const historyContent = document.getElementById("historyContent")!;
const historyPanel = document.getElementById("historyPanel")!;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}

function getDeck() {
  return decks[quizMode];
}

function getGuessedCards() {
  return guessedByMode[quizMode];
}

function updateStats() {
  const deck = getDeck();
  const guessedCards = getGuessedCards();

  guessedCount.textContent = String(guessedCards.length);
  remainCount.textContent = String(deck.length);

  if (guessedCards.length === 0) {
    guessedList.innerHTML = `<div class="empty">ยังไม่มีคำที่ทายแล้ว</div>`;
    return;
  }

  guessedList.innerHTML = guessedCards
    .map(
      (card, index) => `
      <div class="guessed-item">
        <div class="guessed-number">${index + 1}</div>
        <div>
          <div class="guessed-kanji">${card.kanji}</div>
          <div class="guessed-reading">${card.reading}</div>
          <div class="guessed-meaning">${card.th} / ${card.en}</div>
        </div>
      </div>
    `
    )
    .join("");
}

function pick() {
  const deck = getDeck();

  updateStats();

  if (deck.length === 0) {
    current = null;
    question.className = "card";
    question.textContent = "🎉 Done!";
    answer.innerHTML = `
      <div class="done-box">
        เก่งมาก! ทายครบโหมดนี้แล้ว 🎊
      </div>
    `;
    return;
  }

  current = deck[Math.floor(Math.random() * deck.length)];
  answer.innerHTML = "";

  if (quizMode === "jp-to-meaning") {
    question.className = "card jp-question";
    question.textContent = current.kanji;
  } else if (quizMode === "meaning-to-jp") {
    question.className = "card meaning-question";
    question.innerHTML = `
    <div class="meaning-question-content">
      <div class="th-question">${current.th}</div>
      <div class="en-question">${current.en}</div>
    </div>
  `;
  } else {
    question.className = "card reading-question";
    question.textContent = current.reading;
  }
}

async function load() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}vocab.json`);
    originalDeck = await res.json();

    decks = {
      "jp-to-meaning": [...originalDeck],
      "meaning-to-jp": [...originalDeck],
      "reading-to-jp": [...originalDeck],
    };

    guessedByMode = {
      "jp-to-meaning": [],
      "meaning-to-jp": [],
      "reading-to-jp": [],
    };

    pick();
  } catch (e) {
    console.error("โหลด vocab.json ไม่ได้", e);
  }
}

function showAnswer() {
  if (!current) return;

  if (quizMode === "jp-to-meaning") {
    answer.innerHTML = `
      <div class="answer-card">

      <div class="answer-section">
        <span class="pill pink">READING</span>
        <div class="reading">${current.reading}</div>
      </div>
      
        <div class="answer-section">
          <span class="pill blue">EN</span>
          <div class="en">${current.en}</div>
        </div>

        <div class="answer-section">
          <span class="pill green">TH</span>
          <div class="th">${current.th}</div>
        </div>

        <div class="example-box">
          <div class="example-title">ตัวอย่างประโยค</div>
          <div class="jp">${current.example_kanji}</div>
          <div class="kana">${current.example_kana}</div>
          <div class="en">${current.example_en}</div>
          <div class="th">${current.example_th}</div>
        </div>
      </div>
    `;
    return;
  }

  if (quizMode === "reading-to-jp") {
    answer.innerHTML = `
    <div class="answer-card">
      <div class="answer-section">
        <span class="pill blue">JP</span>
        <div class="jp">${current.kanji}</div>
      </div>

      <div class="answer-section">
        <span class="pill pink">READING</span>
        <div class="reading">${current.reading}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${current.th}</div>
        <div class="en">${current.en}</div>
      </div>

      <div class="example-box">
        <div class="example-title">ตัวอย่างประโยค</div>
        <div class="jp">${current.example_kanji}</div>
        <div class="kana">${current.example_kana}</div>
        <div class="en">${current.example_en}</div>
        <div class="th">${current.example_th}</div>
      </div>
    </div>
  `;
    return;
  }

  answer.innerHTML = `
    <div class="answer-card">
      <div class="answer-section">
        <span class="pill blue">JP</span>
        <div class="jp">${current.kanji}</div>
        <div class="kana">${current.reading}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${current.th}</div>
        <div class="en">${current.en}</div>
      </div>

      <div class="example-box">
        <div class="example-title">ตัวอย่างประโยค</div>
        <div class="jp">${current.example_kanji}</div>
        <div class="kana">${current.example_kana}</div>
        <div class="en">${current.example_en}</div>
        <div class="th">${current.example_th}</div>
      </div>
    </div>
  `;
}

function nextCard() {
  if (!current) return;

  guessedByMode[quizMode].push(current);
  decks[quizMode] = decks[quizMode].filter((c) => c.id !== current!.id);

  pick();
}

function skipCard() {
  pick();
}

function restart() {
  decks[quizMode] = [...originalDeck];
  guessedByMode[quizMode] = [];
  answer.innerHTML = "";
  pick();
}

(document.getElementById("showBtn") as HTMLButtonElement).onclick = showAnswer;
(document.getElementById("nextBtn") as HTMLButtonElement).onclick = nextCard;
(document.getElementById("skipBtn") as HTMLButtonElement).onclick = skipCard;
(document.getElementById("restartBtn") as HTMLButtonElement).onclick = restart;

document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    quizMode = radio.value as QuizMode;
    answer.innerHTML = "";
    pick();
  });
});

historyToggleBtn.onclick = () => {
  historyPanel.classList.toggle("hidden");

  const isHidden = historyPanel.classList.contains("hidden");

  historyToggleBtn.textContent = isHidden
    ? "✅ ดูคำที่ทายไปแล้ว"
    : "🙈 ซ่อนคำที่ทายไปแล้ว";
};

load();