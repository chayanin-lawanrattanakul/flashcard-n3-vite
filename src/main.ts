import "./style.css";

type VocabCard = {
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

type GrammarCard = {
  id: number;
  grammar: string;
  meaning_en: string;
  meaning_th: string;
  structure: string;
  example_kanji: string;
  example_kana: string;
  example_en: string;
  example_th: string;
};

type Category = "vocab" | "grammar";
type QuizMode = "jp-to-meaning" | "meaning-to-jp" | "reading-to-jp";
type ExerciseMode = QuizMode | "mixed";

let category: Category = "vocab";
let quizMode: QuizMode = "jp-to-meaning";

let originalVocabDeck: VocabCard[] = [];
let originalGrammarDeck: GrammarCard[] = [];

let vocabDecks: Record<QuizMode, VocabCard[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};

let grammarDecks: Record<QuizMode, GrammarCard[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};

let guessedGrammarByMode: Record<QuizMode, GrammarCard[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};

let guessedVocabByMode: Record<QuizMode, VocabCard[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};


let current: VocabCard | GrammarCard | null = null;

const question = document.getElementById("question")!;
const answer = document.getElementById("answer")!;
const guessedCount = document.getElementById("guessedCount")!;
const guessedList = document.getElementById("guessedList")!;
const remainCount = document.getElementById("remainCount")!;
const historyToggleBtn = document.getElementById("historyToggleBtn") as HTMLButtonElement;
const historyPanel = document.getElementById("historyPanel")!;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}

function isVocab(card: VocabCard | GrammarCard): card is VocabCard {
  return "kanji" in card;
}

function getDeck() {
  return category === "vocab" ? vocabDecks[quizMode] : grammarDecks[quizMode];
}

function getGuessedCards() {
  return category === "vocab"
    ? guessedVocabByMode[quizMode]
    : guessedGrammarByMode[quizMode];
}



function updateStats() {
  const deck = getDeck();
  const guessedCards = getGuessedCards();

  guessedCount.textContent = String(guessedCards.length);
  remainCount.textContent = String(deck.length);

  if (guessedCards.length === 0) {
    guessedList.innerHTML = `<div class="empty">ยังไม่มีข้อที่ทายแล้ว</div>`;
    return;
  }

  guessedList.innerHTML = guessedCards
    .map((card, index) => {
      if (isVocab(card)) {
        return `
          <div class="guessed-item">
            <div class="guessed-number">${index + 1}</div>
            <div>
              <div class="guessed-kanji">${card.kanji}</div>
              <div class="guessed-reading">${card.reading}</div>
              <div class="guessed-meaning">${card.th} / ${card.en}</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="guessed-item">
          <div class="guessed-number">${index + 1}</div>
          <div>
            <div class="guessed-kanji">${card.grammar}</div>
            <div class="guessed-reading">${card.structure}</div>
            <div class="guessed-meaning">${card.meaning_th} / ${card.meaning_en}</div>
          </div>
        </div>
      `;
    })
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
        เก่งมาก! ทายครบหมวดนี้แล้ว 🎊
      </div>
    `;
    return;
  }

  current = deck[Math.floor(Math.random() * deck.length)];
  answer.innerHTML = "";

  if (category === "grammar") {
    const card = current as GrammarCard;

    if (quizMode === "jp-to-meaning") {
      question.className = "card jp-question";
      question.innerHTML = `
      <div class="jp">${card.example_kanji}</div>
    `;
    } else if (quizMode === "meaning-to-jp") {
      question.className = "card meaning-question";
      question.innerHTML = `
      <div class="meaning-question-content">
        <div class="th-question">${card.example_th}</div>
        <div class="en-question">${card.example_en}</div>
      </div>
    `;
    } else {
      question.className = "card reading-question";
      question.innerHTML = `
      <div class="reading">${card.example_kana}</div>
    `;
    }

    return;
  }

  const card = current as VocabCard;

  if (quizMode === "jp-to-meaning") {
    question.className = "card jp-question";
    question.textContent = card.kanji;
  } else if (quizMode === "meaning-to-jp") {
    question.className = "card meaning-question";
    question.innerHTML = `
      <div class="meaning-question-content">
        <div class="th-question">${card.th}</div>
        <div class="en-question">${card.en}</div>
      </div>
    `;
  } else {
    question.className = "card reading-question";
    question.textContent = card.reading;
  }
}

async function load() {
  try {
    const vocabRes = await fetch(`${import.meta.env.BASE_URL}vocab.json`);
    const grammarRes = await fetch(`${import.meta.env.BASE_URL}grammar.json`);

    originalVocabDeck = await vocabRes.json();
    originalGrammarDeck = await grammarRes.json();

    vocabDecks = {
      "jp-to-meaning": [...originalVocabDeck],
      "meaning-to-jp": [...originalVocabDeck],
      "reading-to-jp": [...originalVocabDeck],
    };

    grammarDecks = {
      "jp-to-meaning": [...originalGrammarDeck],
      "meaning-to-jp": [...originalGrammarDeck],
      "reading-to-jp": [...originalGrammarDeck],
    };

    pick();
  } catch (e) {
    console.error("โหลดไฟล์ json ไม่ได้", e);
  }
}

function showAnswer() {
  if (!current) return;

 if (category === "grammar") {
  const card = current as GrammarCard;

  answer.innerHTML = `
    <div class="answer-card">
      <div class="answer-section">
        <span class="pill blue">JP</span>
        <div class="jp">${card.example_kanji}</div>
      </div>

      <div class="answer-section">
        <span class="pill pink">HIRAGANA</span>
        <div class="reading">${card.example_kana}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${card.example_th}</div>
        <div class="en">${card.example_en}</div>
      </div>

      <div class="answer-section">
        <span class="pill blue">GRAMMAR</span>
        <div class="jp">${card.grammar}</div>
        <div class="reading">${card.structure}</div>
      </div>
    </div>
  `;
  return;
}
  const card = current as VocabCard;

  if (quizMode === "jp-to-meaning") {
    answer.innerHTML = `
      <div class="answer-card">
        <div class="answer-section">
          <span class="pill pink">READING</span>
          <div class="reading">${card.reading}</div>
        </div>

        <div class="answer-section">
          <span class="pill blue">EN</span>
          <div class="en">${card.en}</div>
        </div>

        <div class="answer-section">
          <span class="pill green">TH</span>
          <div class="th">${card.th}</div>
        </div>

        <div class="example-box">
          <div class="example-title">ตัวอย่างประโยค</div>
          <div class="jp">${card.example_kanji}</div>
          <div class="kana">${card.example_kana}</div>
          <div class="en">${card.example_en}</div>
          <div class="th">${card.example_th}</div>
        </div>
      </div>
    `;
    return;
  }

  answer.innerHTML = `
    <div class="answer-card">
      <div class="answer-section">
        <span class="pill blue">JP</span>
        <div class="jp">${card.kanji}</div>
        <div class="kana">${card.reading}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${card.th}</div>
        <div class="en">${card.en}</div>
      </div>

      <div class="example-box">
        <div class="example-title">ตัวอย่างประโยค</div>
        <div class="jp">${card.example_kanji}</div>
        <div class="kana">${card.example_kana}</div>
        <div class="en">${card.example_en}</div>
        <div class="th">${card.example_th}</div>
      </div>
    </div>
  `;
}

function nextCard() {
  if (!current) return;

  if (category === "vocab") {
    const card = current as VocabCard;
    guessedVocabByMode[quizMode].push(card);
    vocabDecks[quizMode] = vocabDecks[quizMode].filter((c) => c.id !== card.id);
  } else {
  const card = current as GrammarCard;
  guessedGrammarByMode[quizMode].push(card);
  grammarDecks[quizMode] = grammarDecks[quizMode].filter((c) => c.id !== card.id);
}

  pick();
}

function skipCard() {
  pick();
}

function restart() {
  if (category === "vocab") {
    vocabDecks[quizMode] = [...originalVocabDeck];
    guessedVocabByMode[quizMode] = [];
  } else {
  grammarDecks[quizMode] = [...originalGrammarDeck];
  guessedGrammarByMode[quizMode] = [];
}

  answer.innerHTML = "";
  pick();
}

function shuffleCards<T>(cards: T[]): T[] {
  return [...cards].sort(() => Math.random() - 0.5);
}

function getExerciseQuestion(
  card: VocabCard | GrammarCard,
  mode: ExerciseMode
) {
  const realMode: QuizMode =
    mode === "mixed"
      ? (["jp-to-meaning", "reading-to-jp", "meaning-to-jp"][
          Math.floor(Math.random() * 3)
        ] as QuizMode)
      : mode;

  if (isVocab(card)) {
    if (realMode === "jp-to-meaning") return card.kanji;
    if (realMode === "reading-to-jp") return card.reading;
    return `${card.th} / ${card.en}`;
  }

  if (realMode === "jp-to-meaning") return card.example_kanji;
  if (realMode === "reading-to-jp") return card.example_kana;
  return `${card.example_th} / ${card.example_en}`;
}

function getExerciseAnswer(card: VocabCard | GrammarCard) {
  if (isVocab(card)) {
    return `
      ${card.kanji}<br/>
      อ่านว่า: ${card.reading}<br/>
      ความหมาย: ${card.th} / ${card.en}<br/>
      ตัวอย่าง: ${card.example_kanji}<br/>
      ${card.example_kana}<br/>
      ${card.example_th} / ${card.example_en}
    `;
  }

  return `
    ${card.grammar}<br/>
    โครงสร้าง: ${card.structure}<br/>
    ความหมาย: ${card.meaning_th} / ${card.meaning_en}<br/>
    ตัวอย่าง: ${card.example_kanji}<br/>
    ${card.example_kana}<br/>
    ${card.example_th} / ${card.example_en}
  `;
}

function downloadExerciseDocument() {
  const exerciseMode = (
    document.getElementById("exerciseMode") as HTMLSelectElement
  ).value as ExerciseMode;

  const cards =
    category === "vocab"
      ? shuffleCards(originalVocabDeck)
      : shuffleCards(originalGrammarDeck);

  const questions = cards
    .map((card, index) => {
      return `
        <p>
          ${index + 1}. คำศัพท์ที่ให้ทายคำที่ ${index + 1}: 
          ${getExerciseQuestion(card, exerciseMode)}
          ........................................
        </p>
      `;
    })
    .join("");

  const answers = cards
    .map((card, index) => {
      return `
        <p>
          ${index + 1}. ${getExerciseAnswer(card)}
        </p>
      `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            line-height: 1.7;
          }
          h1, h2 {
            text-align: center;
          }
          p {
            margin-bottom: 18px;
          }
          .page-break {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        <h1>แบบฝึกหัด N3</h1>
        <h2>แบบฝึกหัด</h2>
        ${questions}

        <div class="page-break"></div>

        <h1>เฉลย</h1>
        ${answers}
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/msword;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "N3-exercise.doc";
  a.click();

  URL.revokeObjectURL(url);
}

(document.getElementById("showBtn") as HTMLButtonElement).onclick = showAnswer;
(document.getElementById("nextBtn") as HTMLButtonElement).onclick = nextCard;
(document.getElementById("skipBtn") as HTMLButtonElement).onclick = skipCard;
(document.getElementById("restartBtn") as HTMLButtonElement).onclick = restart;
(document.getElementById("downloadExerciseBtn") as HTMLButtonElement).onclick =
  downloadExerciseDocument;

document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    quizMode = radio.value as QuizMode;
    answer.innerHTML = "";
    pick();
  });
});

document.querySelectorAll<HTMLInputElement>('input[name="category"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    category = radio.value as Category;
    answer.innerHTML = "";
    pick();
  });
});

historyToggleBtn.onclick = () => {
  historyPanel.classList.toggle("hidden");

  const isHidden = historyPanel.classList.contains("hidden");

  historyToggleBtn.textContent = isHidden
    ? "✅ ดูข้อที่ทายไปแล้ว"
    : "🙈 ซ่อนข้อที่ทายไปแล้ว";
};

load();