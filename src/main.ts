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

let deck: Card[] = [];
let current: Card | null = null;

const question = document.getElementById("question")!;
const answer = document.getElementById("answer")!;

async function load() {
  const res = await fetch("/vocab.json");
  deck = await res.json();
  pick();
}

function pick() {
  if (deck.length === 0) {
    question.textContent = "🎉 Done!";
    answer.innerHTML = "";
    return;
  }

  current = deck[Math.floor(Math.random() * deck.length)];

  question.textContent = current.kanji;
  answer.innerHTML = "";
}

function showAnswer() {
  if (!current) return;

  answer.innerHTML = `
    <div class="box">
      <div class="label">EN</div>
      <div class="en">${current.en}</div>
    </div>

    <div class="box">
      <div class="label">TH</div>
      <div class="th">${current.th}</div>
    </div>

    <div class="box">
      <div class="label">EXAMPLE (JP)</div>
      <div class="jp">${current.example_kanji}</div>
    </div>

    <div class="box">
      <div class="kana">${current.example_kana}</div>
    </div>

    <div class="box">
      <div class="en">${current.example_en}</div>
    </div>

    <div class="box">
      <div class="th">${current.example_th}</div>
    </div>
  `;
}

function nextCard() {
  if (!current) return;

  deck = deck.filter(c => c.id !== current!.id);
  pick();
}

function skipCard() {
  pick();
}

function restart() {
  load();
}

/* BUTTON EVENTS */
(document.getElementById("showBtn") as HTMLButtonElement).onclick = showAnswer;
(document.getElementById("nextBtn") as HTMLButtonElement).onclick = nextCard;
(document.getElementById("skipBtn") as HTMLButtonElement).onclick = skipCard;
(document.getElementById("restartBtn") as HTMLButtonElement).onclick = restart;

load();