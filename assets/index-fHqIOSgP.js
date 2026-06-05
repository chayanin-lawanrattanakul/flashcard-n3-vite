(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[],t=null,n=`jp-to-meaning`,r={"jp-to-meaning":[],"meaning-to-jp":[]},i={"jp-to-meaning":[],"meaning-to-jp":[]},a=document.getElementById(`question`),o=document.getElementById(`answer`),s=document.getElementById(`guessedCount`),c=document.getElementById(`guessedList`),l=document.getElementById(`remainCount`),u=document.getElementById(`historyToggleBtn`),d=document.getElementById(`historyPanel`);`serviceWorker`in navigator&&navigator.serviceWorker.register(`/flashcard-n3-vite/sw.js`);function f(){return r[n]}function p(){return i[n]}function m(){let e=f(),t=p();if(s.textContent=String(t.length),l.textContent=String(e.length),t.length===0){c.innerHTML=`<div class="empty">ยังไม่มีคำที่ทายแล้ว</div>`;return}c.innerHTML=t.map((e,t)=>`
      <div class="guessed-item">
        <div class="guessed-number">${t+1}</div>
        <div>
          <div class="guessed-kanji">${e.kanji}</div>
          <div class="guessed-meaning">${e.th} / ${e.en}</div>
        </div>
      </div>
    `).join(``)}function h(){let e=f();if(m(),e.length===0){t=null,a.className=`card`,a.textContent=`🎉 Done!`,o.innerHTML=`
      <div class="done-box">
        เก่งมาก! ทายครบโหมดนี้แล้ว 🎊
      </div>
    `;return}t=e[Math.floor(Math.random()*e.length)],o.innerHTML=``,n===`jp-to-meaning`?(a.className=`card jp-question`,a.textContent=t.kanji):(a.className=`card meaning-question`,a.innerHTML=`
      <div class="meaning-question-content">
        <div class="th-question">${t.th}</div>
        <div class="en-question">${t.en}</div>
      </div>
    `)}async function g(){try{e=await(await fetch(`/flashcard-n3-vite/vocab.json`)).json(),r={"jp-to-meaning":[...e],"meaning-to-jp":[...e]},i={"jp-to-meaning":[],"meaning-to-jp":[]},h()}catch(e){console.error(`โหลด vocab.json ไม่ได้`,e)}}function _(){if(t){if(n===`jp-to-meaning`){o.innerHTML=`
      <div class="answer-card">

      <div class="answer-section">
        <span class="pill pink">READING</span>
        <div class="reading">${t.reading}</div>
      </div>
      
        <div class="answer-section">
          <span class="pill blue">EN</span>
          <div class="en">${t.en}</div>
        </div>

        <div class="answer-section">
          <span class="pill green">TH</span>
          <div class="th">${t.th}</div>
        </div>

        <div class="example-box">
          <div class="example-title">ตัวอย่างประโยค</div>
          <div class="jp">${t.example_kanji}</div>
          <div class="kana">${t.example_kana}</div>
          <div class="en">${t.example_en}</div>
          <div class="th">${t.example_th}</div>
        </div>
      </div>
    `;return}o.innerHTML=`
    <div class="answer-card">
      <div class="answer-section">
        <span class="pill blue">JP</span>
        <div class="jp">${t.kanji}</div>
        <div class="kana">${t.reading}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${t.th}</div>
        <div class="en">${t.en}</div>
      </div>

      <div class="example-box">
        <div class="example-title">ตัวอย่างประโยค</div>
        <div class="jp">${t.example_kanji}</div>
        <div class="kana">${t.example_kana}</div>
        <div class="en">${t.example_en}</div>
        <div class="th">${t.example_th}</div>
      </div>
    </div>
  `}}function v(){t&&(i[n].push(t),r[n]=r[n].filter(e=>e.id!==t.id),h())}function y(){h()}function b(){r[n]=[...e],i[n]=[],o.innerHTML=``,h()}document.getElementById(`showBtn`).onclick=_,document.getElementById(`nextBtn`).onclick=v,document.getElementById(`skipBtn`).onclick=y,document.getElementById(`restartBtn`).onclick=b,document.querySelectorAll(`input[name="mode"]`).forEach(e=>{e.addEventListener(`change`,()=>{n=e.value,o.innerHTML=``,h()})}),u.onclick=()=>{d.classList.toggle(`hidden`),u.textContent=d.classList.contains(`hidden`)?`✅ ดูคำที่ทายไปแล้ว`:`🙈 ซ่อนคำที่ทายไปแล้ว`},g();