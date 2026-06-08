(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`vocab`,t=`jp-to-meaning`,n=[],r=[],i={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},a={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},o={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},s={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},c=null,l=document.getElementById(`question`),u=document.getElementById(`answer`),d=document.getElementById(`guessedCount`),f=document.getElementById(`guessedList`),p=document.getElementById(`remainCount`),m=document.getElementById(`historyToggleBtn`),h=document.getElementById(`historyPanel`);`serviceWorker`in navigator&&navigator.serviceWorker.register(`/flashcard-n3-vite/sw.js`);function g(e){return`kanji`in e}function _(){return e===`vocab`?i[t]:a[t]}function v(){return e===`vocab`?s[t]:o[t]}function y(){let e=_(),t=v();if(d.textContent=String(t.length),p.textContent=String(e.length),t.length===0){f.innerHTML=`<div class="empty">ยังไม่มีข้อที่ทายแล้ว</div>`;return}f.innerHTML=t.map((e,t)=>g(e)?`
          <div class="guessed-item">
            <div class="guessed-number">${t+1}</div>
            <div>
              <div class="guessed-kanji">${e.kanji}</div>
              <div class="guessed-reading">${e.reading}</div>
              <div class="guessed-meaning">${e.th} / ${e.en}</div>
            </div>
          </div>
        `:`
        <div class="guessed-item">
          <div class="guessed-number">${t+1}</div>
          <div>
            <div class="guessed-kanji">${e.grammar}</div>
            <div class="guessed-reading">${e.structure}</div>
            <div class="guessed-meaning">${e.meaning_th} / ${e.meaning_en}</div>
          </div>
        </div>
      `).join(``)}function b(){let n=_();if(y(),n.length===0){c=null,l.className=`card`,l.textContent=`🎉 Done!`,u.innerHTML=`
      <div class="done-box">
        เก่งมาก! ทายครบหมวดนี้แล้ว 🎊
      </div>
    `;return}if(c=n[Math.floor(Math.random()*n.length)],u.innerHTML=``,e===`grammar`){let e=c;t===`jp-to-meaning`?(l.className=`card jp-question`,l.innerHTML=`
      <div class="jp">${e.example_kanji}</div>
    `):t===`meaning-to-jp`?(l.className=`card meaning-question`,l.innerHTML=`
      <div class="meaning-question-content">
        <div class="th-question">${e.example_th}</div>
        <div class="en-question">${e.example_en}</div>
      </div>
    `):(l.className=`card reading-question`,l.innerHTML=`
      <div class="reading">${e.example_kana}</div>
    `);return}let r=c;t===`jp-to-meaning`?(l.className=`card jp-question`,l.textContent=r.kanji):t===`meaning-to-jp`?(l.className=`card meaning-question`,l.innerHTML=`
      <div class="meaning-question-content">
        <div class="th-question">${r.th}</div>
        <div class="en-question">${r.en}</div>
      </div>
    `):(l.className=`card reading-question`,l.textContent=r.reading)}async function x(){try{let e=await fetch(`/flashcard-n3-vite/vocab.json`),t=await fetch(`/flashcard-n3-vite/grammar.json`);n=await e.json(),r=await t.json(),i={"jp-to-meaning":[...n],"meaning-to-jp":[...n],"reading-to-jp":[...n]},a={"jp-to-meaning":[...r],"meaning-to-jp":[...r],"reading-to-jp":[...r]},b()}catch(e){console.error(`โหลดไฟล์ json ไม่ได้`,e)}}function S(){if(!c)return;if(e===`grammar`){let e=c;u.innerHTML=`
    <div class="answer-card">
      <div class="answer-section">
        <span class="pill blue">JP</span>
        <div class="jp">${e.example_kanji}</div>
      </div>

      <div class="answer-section">
        <span class="pill pink">HIRAGANA</span>
        <div class="reading">${e.example_kana}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${e.example_th}</div>
        <div class="en">${e.example_en}</div>
      </div>

      <div class="answer-section">
        <span class="pill blue">GRAMMAR</span>
        <div class="jp">${e.grammar}</div>
        <div class="reading">${e.structure}</div>
      </div>
    </div>
  `;return}let n=c;if(t===`jp-to-meaning`){u.innerHTML=`
      <div class="answer-card">
        <div class="answer-section">
          <span class="pill pink">READING</span>
          <div class="reading">${n.reading}</div>
        </div>

        <div class="answer-section">
          <span class="pill blue">EN</span>
          <div class="en">${n.en}</div>
        </div>

        <div class="answer-section">
          <span class="pill green">TH</span>
          <div class="th">${n.th}</div>
        </div>

        <div class="example-box">
          <div class="example-title">ตัวอย่างประโยค</div>
          <div class="jp">${n.example_kanji}</div>
          <div class="kana">${n.example_kana}</div>
          <div class="en">${n.example_en}</div>
          <div class="th">${n.example_th}</div>
        </div>
      </div>
    `;return}u.innerHTML=`
    <div class="answer-card">
      <div class="answer-section">
        <span class="pill blue">JP</span>
        <div class="jp">${n.kanji}</div>
        <div class="kana">${n.reading}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${n.th}</div>
        <div class="en">${n.en}</div>
      </div>

      <div class="example-box">
        <div class="example-title">ตัวอย่างประโยค</div>
        <div class="jp">${n.example_kanji}</div>
        <div class="kana">${n.example_kana}</div>
        <div class="en">${n.example_en}</div>
        <div class="th">${n.example_th}</div>
      </div>
    </div>
  `}function C(){if(c){if(e===`vocab`){let e=c;s[t].push(e),i[t]=i[t].filter(t=>t.id!==e.id)}else{let e=c;o[t].push(e),a[t]=a[t].filter(t=>t.id!==e.id)}b()}}function w(){b()}function T(){e===`vocab`?(i[t]=[...n],s[t]=[]):(a[t]=[...r],o[t]=[]),u.innerHTML=``,b()}document.getElementById(`showBtn`).onclick=S,document.getElementById(`nextBtn`).onclick=C,document.getElementById(`skipBtn`).onclick=w,document.getElementById(`restartBtn`).onclick=T,document.querySelectorAll(`input[name="mode"]`).forEach(e=>{e.addEventListener(`change`,()=>{t=e.value,u.innerHTML=``,b()})}),document.querySelectorAll(`input[name="category"]`).forEach(t=>{t.addEventListener(`change`,()=>{e=t.value,u.innerHTML=``,b()})}),m.onclick=()=>{h.classList.toggle(`hidden`),m.textContent=h.classList.contains(`hidden`)?`✅ ดูข้อที่ทายไปแล้ว`:`🙈 ซ่อนข้อที่ทายไปแล้ว`},x();