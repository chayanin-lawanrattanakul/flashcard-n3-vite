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

type PracticeMode =
  | "kanji-to-meaning-reading"
  | "reading-to-kanji-meaning"
  | "mixed";

type Category = "vocab" | "grammar";
type QuizMode = "jp-to-meaning" | "meaning-to-jp" | "reading-to-jp";
type ExerciseMode = QuizMode | "mixed";

let category: Category = "vocab";
let quizMode: QuizMode = "jp-to-meaning";
let isChoiceMode = false;
let practiceMode: PracticeMode = "kanji-to-meaning-reading";

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

let guessedVocabByMode: Record<QuizMode, VocabCard[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};

let guessedGrammarByMode: Record<QuizMode, GrammarCard[]> = {
  "jp-to-meaning": [],
  "meaning-to-jp": [],
  "reading-to-jp": [],
};

let choiceQuizDeck: VocabCard[] = [];
let guessedChoiceQuizCards: VocabCard[] = [];

let current: VocabCard | GrammarCard | null = null;

const question = document.getElementById("question")!;
const answer = document.getElementById("answer")!;
const guessedCount = document.getElementById("guessedCount")!;
const guessedList = document.getElementById("guessedList")!;
const remainCount = document.getElementById("remainCount")!;

const historyToggleBtn = document.getElementById("historyToggleBtn") as HTMLButtonElement;
const historyPanel = document.getElementById("historyPanel")!;
const flashcard = document.getElementById("flashcard")!;

const showBtn = document.getElementById("showBtn") as HTMLButtonElement;
const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
const skipBtn = document.getElementById("skipBtn") as HTMLButtonElement;
const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement;

const backFlashcardBtn = document.getElementById("backFlashcardBtn") as HTMLButtonElement;
const quizNextBtn = document.getElementById("quizNextBtn") as HTMLButtonElement;
const quizRestartBtn = document.getElementById("quizRestartBtn") as HTMLButtonElement;
const quizAnswerBtn = document.getElementById("quizAnswerBtn") as HTMLButtonElement;
const quizHistoryToggleBtn = document.getElementById("quizHistoryToggleBtn") as HTMLButtonElement;

const flashcardControls = document.getElementById("flashcardControls")!;
const quizControls = document.getElementById("quizControls")!;
const exerciseControls = document.getElementById("exerciseControls")!;
const flashcardTabBtn = document.getElementById("flashcardTabBtn") as HTMLButtonElement;
const quizTabBtn = document.getElementById("quizTabBtn") as HTMLButtonElement;

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
// }

function isVocab(card: VocabCard | GrammarCard): card is VocabCard {
  return "kanji" in card;
}

function setUIMode(mode: "flashcard" | "quiz") {
  const isQuiz = mode === "quiz";
  isChoiceMode = isQuiz;

  flashcardControls.classList.toggle("hidden", isQuiz);
  exerciseControls.classList.toggle("hidden", isQuiz);
  quizControls.classList.toggle("hidden", !isQuiz);

  flashcardTabBtn.classList.toggle("active", !isQuiz);
  quizTabBtn.classList.toggle("active", isQuiz);

  flashcard.classList.remove("is-flipped");
  answer.innerHTML = "";
  showBtn.textContent = "Show";
  quizAnswerBtn.classList.add("hidden");
  quizNextBtn.classList.toggle("hidden", isQuiz);
  historyPanel.classList.add("hidden");
  updateHistoryButtonText();

  updateStats();
}

function getDeck() {
  return category === "vocab" ? vocabDecks[quizMode] : grammarDecks[quizMode];
}

function getGuessedCards() {
  return category === "vocab"
    ? guessedVocabByMode[quizMode]
    : guessedGrammarByMode[quizMode];
}

function getRandomPracticeMode(): Exclude<PracticeMode, "mixed"> {
  const modes: Exclude<PracticeMode, "mixed">[] = [
    "kanji-to-meaning-reading",
    "reading-to-kanji-meaning",
  ];

  return modes[Math.floor(Math.random() * modes.length)];
}

function startChoiceQuiz() {
  const selected = (
    document.getElementById("quizMode") as HTMLSelectElement
  ).value as PracticeMode | "";

  setUIMode("quiz");

  if (!selected) {
    current = null;
    question.className = "card";
    question.innerHTML = "กรุณาเลือกประเภท Quiz ก่อนครับ";
    answer.innerHTML = "";
    return;
  }

  if (category !== "vocab") {
    current = null;
    question.className = "card";
    question.innerHTML = "ตอนนี้แบบฝึกหัดช้อยส์รองรับเฉพาะคำศัพท์ก่อนครับ";
    answer.innerHTML = "";
    return;
  }

  practiceMode = selected;
  choiceQuizDeck = [...originalVocabDeck];
  guessedChoiceQuizCards = [];

  updateStats();
  renderChoiceQuestion();
}

function renderChoiceQuestion() {
  const deck = choiceQuizDeck;
  quizAnswerBtn.classList.add("hidden");
  quizNextBtn.classList.add("hidden");

  if (deck.length < 4) {
    current = null;
    question.className = "card";
    question.textContent = "🎉 ทำแบบฝึกหัดครบแล้ว!";
    answer.innerHTML = "";
    quizAnswerBtn.classList.add("hidden");
    quizNextBtn.classList.add("hidden");
    updateStats();
    return;
  }

  const realMode =
    practiceMode === "mixed" ? getRandomPracticeMode() : practiceMode;

  const correct = deck[Math.floor(Math.random() * deck.length)];
  current = correct;

  flashcard.classList.remove("is-flipped");
  answer.innerHTML = "";

  const wrongChoices = shuffleCards(
    deck.filter((card) => card.id !== correct.id)
  ).slice(0, 3);

  const choices = shuffleCards([correct, ...wrongChoices]);

  const questionText =
    realMode === "kanji-to-meaning-reading"
      ? correct.kanji
      : correct.reading;

  const choiceText = (choice: VocabCard) => {
    if (realMode === "kanji-to-meaning-reading") {
      return `
        <div class="choice-main">${choice.reading}</div>
        <div class="choice-sub">${choice.th} / ${choice.en}</div>
      `;
    }

    return `
      <div class="choice-main">${choice.kanji}</div>
      <div class="choice-sub">${choice.th} / ${choice.en}</div>
    `;
  };

  question.className = "card choice-card";
  question.innerHTML = `
    <div class="choice-box">
      <div class="choice-question">${questionText}</div>

      ${choices
        .map(
          (choice) => `
            <button class="choice-option" data-id="${choice.id}">
              ${choiceText(choice)}
            </button>
          `
        )
        .join("")}

      <div class="choice-result" id="choiceResult"></div>
    </div>
  `;

  document.querySelectorAll<HTMLButtonElement>(".choice-option").forEach((btn) => {
    btn.onclick = () => {
      const selectedId = Number(btn.dataset.id);
      const result = document.getElementById("choiceResult")!;

      document.querySelectorAll<HTMLButtonElement>(".choice-option").forEach((option) => {
        option.disabled = true;

        if (Number(option.dataset.id) === correct.id) {
          option.classList.add("correct");
        }
      });

      if (selectedId === correct.id) {
        result.textContent = "ถูกต้อง 🎉";
      } else {
        btn.classList.add("wrong");
        result.textContent = "ผิดครับ 😢";
      }

      quizAnswerBtn.classList.remove("hidden");
    };
  });
}

function renderVocabAnswerCard(card: VocabCard) {
  return `
    <div class="answer-card">
      <div class="answer-section answer-head">
        <span class="pill blue">JP</span>
        <div class="jp answer-main-kanji">${card.kanji}</div>
      </div>

      <div class="answer-section">
        <span class="pill pink">READING</span>
        <div class="reading">${card.reading}</div>
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

function showQuizAnswer() {
  if (!current || !isChoiceMode) return;

  const card = current as VocabCard;
  answer.innerHTML = renderVocabAnswerCard(card);
  flashcard.classList.add("is-flipped");

  quizAnswerBtn.classList.add("hidden");
  quizNextBtn.classList.remove("hidden");
}

function updateStats() {
  if (isChoiceMode) {
    guessedCount.textContent = String(guessedChoiceQuizCards.length);
    remainCount.textContent = String(choiceQuizDeck.length);

    if (guessedChoiceQuizCards.length === 0) {
      guessedList.innerHTML = `<div class="empty">ยังไม่มีข้อที่ทำแบบฝึกหัดแล้ว</div>`;
      return;
    }

    guessedList.innerHTML = guessedChoiceQuizCards
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

    return;
  }

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
  flashcard.classList.remove("is-flipped");
  showBtn.textContent = "Show";

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
      question.innerHTML = `<div class="jp">${card.example_kanji}</div>`;
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
      question.innerHTML = `<div class="reading">${card.example_kana}</div>`;
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
  if (!current || isChoiceMode) return;

  if (flashcard.classList.contains("is-flipped")) {
    flashcard.classList.remove("is-flipped");
    showBtn.textContent = "Show";
    return;
  }

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

    flashcard.classList.add("is-flipped");
    showBtn.textContent = "Hide";
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
  } else {
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

  flashcard.classList.add("is-flipped");
  showBtn.textContent = "Hide";
}

function nextCard() {
  if (isChoiceMode) {
    if (current) {
      const card = current as VocabCard;
      guessedChoiceQuizCards.push(card);
      choiceQuizDeck = choiceQuizDeck.filter((c) => c.id !== card.id);
    }

    updateStats();
    renderChoiceQuestion();
    return;
  }

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
  if (isChoiceMode) {
    renderChoiceQuestion();
    return;
  }

  pick();
}

function restart() {
  if (isChoiceMode) {
    choiceQuizDeck = [...originalVocabDeck];
    guessedChoiceQuizCards = [];
    updateStats();
    renderChoiceQuestion();
    return;
  }

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
          ${index + 1}. คำถามที่ ${index + 1}: 
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

showBtn.onclick = showAnswer;
nextBtn.onclick = nextCard;
skipBtn.onclick = skipCard;
restartBtn.onclick = restart;

quizNextBtn.onclick = nextCard;
quizRestartBtn.onclick = restart;
quizAnswerBtn.onclick = showQuizAnswer;

document.getElementById("downloadExerciseBtn")!.onclick = downloadExerciseDocument;

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

function updateHistoryButtonText() {
  const isHidden = historyPanel.classList.contains("hidden");
  const text = isHidden ? "History" : "ซ่อน History";
  historyToggleBtn.textContent = text;
  quizHistoryToggleBtn.textContent = text;
}

function toggleHistory() {
  historyPanel.classList.toggle("hidden");
  updateHistoryButtonText();
}

historyToggleBtn.onclick = toggleHistory;
quizHistoryToggleBtn.onclick = toggleHistory;

flashcardTabBtn.onclick = () => {
  setUIMode("flashcard");
  pick();
};

quizTabBtn.onclick = () => {
  setUIMode("quiz");
  question.className = "card";
  question.innerHTML = "กรุณาเลือกแบบ Quiz";
  answer.innerHTML = "";
  quizAnswerBtn.classList.add("hidden");
  quizNextBtn.classList.add("hidden");
};

backFlashcardBtn.onclick = () => {
  setUIMode("flashcard");
  pick();
};

(document.getElementById("quizMode") as HTMLSelectElement).onchange = () => {
  startChoiceQuiz();
};

load();