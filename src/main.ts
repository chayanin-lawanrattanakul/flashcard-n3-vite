import "./style.css";

type Card = {
  id: number;
  kanji: string;
  en: string;
  th: string;
  example_kanji: string;
  example_kana: string;
  example_en: string;
  example_th: string;
};

let originalDeck: Card[] = [];
let deck: Card[] = [];
let guessedCards: Card[] = [];
let current: Card | null = null;

const question = document.getElementById("question")!;
const answer = document.getElementById("answer")!;
const guessedCount = document.getElementById("guessedCount")!;
const guessedList = document.getElementById("guessedList")!;
const remainCount = document.getElementById("remainCount")!;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}

function updateStats() {
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
          <div class="guessed-meaning">${card.th} / ${card.en}</div>
        </div>
      </div>
    `
    )
    .join("");
}

function pick() {
  updateStats();

  if (deck.length === 0) {
    current = null;
    question.textContent = "🎉 Done!";
    answer.innerHTML = `
      <div class="done-box">
        เก่งมาก! ทายครบทั้งหมดแล้ว 🎊
      </div>
    `;
    return;
  }

  current = deck[Math.floor(Math.random() * deck.length)];
  question.textContent = current.kanji;
  answer.innerHTML = "";
}

async function load() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}vocab.json`);
    originalDeck = await res.json();

    deck = [...originalDeck];
    guessedCards = [];

    pick();
  } catch (e) {
    console.error("โหลด vocab.json ไม่ได้", e);
  }
}

function showAnswer() {
  if (!current) return;

  answer.innerHTML = `
    <div class="answer-card">
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
}

function nextCard() {
  if (!current) return;

  guessedCards.push(current);
  deck = deck.filter((c) => c.id !== current!.id);

  pick();
}

function skipCard() {
  pick();
}

function restart() {
  deck = [...originalDeck];
  guessedCards = [];
  pick();
}

(document.getElementById("showBtn") as HTMLButtonElement).onclick = showAnswer;
(document.getElementById("nextBtn") as HTMLButtonElement).onclick = nextCard;
(document.getElementById("skipBtn") as HTMLButtonElement).onclick = skipCard;
(document.getElementById("restartBtn") as HTMLButtonElement).onclick = restart;

load();