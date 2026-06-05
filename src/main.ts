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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(
    `${import.meta.env.BASE_URL}sw.js`
  );
}

function updateUI() {
  document.getElementById("doneCount")!.textContent = String(done.length);
  document.getElementById("leftCount")!.textContent = String(deck.length);

  const list = document.getElementById("doneList")!;
  list.innerHTML = done
    .slice(-20)
    .map(c => `<div class="done-item">✔ ${c.kanji}</div>`)
    .join("");
}

function pick() {
  if (deck.length === 0) {
    question.textContent = "🎉 Done!";
    answer.innerHTML = "";
    updateUI();
    return;
  }

  current = deck[Math.floor(Math.random() * deck.length)];

  question.textContent = current.kanji;
  answer.innerHTML = "";

  updateUI(); 
}

let done: Card[] = [];

function saveProgress() {
  localStorage.setItem("deck", JSON.stringify(deck));
  localStorage.setItem("done", JSON.stringify(done));
}

function loadProgress() {
  const savedDeck = localStorage.getItem("deck");
  const savedDone = localStorage.getItem("done");

  if (savedDeck) deck = JSON.parse(savedDeck);
  if (savedDone) done = JSON.parse(savedDone);
}

async function load() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}vocab.json`);
    deck = await res.json();

    loadProgress(); 

    pick();
  } catch (e) {
    console.error("โหลด vocab.json ไม่ได้", e);
  }
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
  const card = current;

  done.push(current);
  deck = deck.filter(c => c.id !== card.id);

  saveProgress();
  pick();
  updateUI();
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