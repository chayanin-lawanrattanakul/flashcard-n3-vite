(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`vocab`,t=`jp-to-meaning`,n=!1,r=`kanji-to-meaning-reading`,i=[],a=[],o={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},s={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},c={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},l={"jp-to-meaning":[],"meaning-to-jp":[],"reading-to-jp":[]},u=[],d=[],f=null,p=document.getElementById(`question`),m=document.getElementById(`answer`),h=document.getElementById(`guessedCount`),g=document.getElementById(`guessedList`),_=document.getElementById(`remainCount`),v=document.getElementById(`historyToggleBtn`),y=document.getElementById(`historyPanel`),b=document.getElementById(`flashcard`),x=document.getElementById(`showBtn`),S=document.getElementById(`nextBtn`),C=document.getElementById(`skipBtn`),ee=document.getElementById(`restartBtn`),w=document.getElementById(`backFlashcardBtn`),T=document.getElementById(`quizNextBtn`),E=document.getElementById(`quizRestartBtn`),D=document.getElementById(`quizAnswerBtn`),O=document.getElementById(`quizHistoryToggleBtn`),k=document.getElementById(`flashcardControls`),A=document.getElementById(`quizControls`),j=document.getElementById(`exerciseControls`),M=document.getElementById(`flashcardTabBtn`),N=document.getElementById(`quizTabBtn`);`serviceWorker`in navigator&&navigator.serviceWorker.register(`/flashcard-n3-vite/sw.js`);function P(e){return`kanji`in e}function F(e){let t=e===`quiz`;n=t,k.classList.toggle(`hidden`,t),j.classList.toggle(`hidden`,t),A.classList.toggle(`hidden`,!t),M.classList.toggle(`active`,!t),N.classList.toggle(`active`,t),b.classList.remove(`is-flipped`),m.innerHTML=``,x.textContent=`Show`,D.classList.add(`hidden`),T.classList.toggle(`hidden`,t),y.classList.add(`hidden`),Q(),H()}function I(){return e===`vocab`?o[t]:s[t]}function te(){return e===`vocab`?c[t]:l[t]}function L(){let e=[`kanji-to-meaning-reading`,`reading-to-kanji-meaning`];return e[Math.floor(Math.random()*e.length)]}function R(){let t=document.getElementById(`quizMode`).value;if(F(`quiz`),!t){f=null,p.className=`card`,p.innerHTML=`กรุณาเลือกประเภท Quiz ก่อนครับ`,m.innerHTML=``;return}if(e!==`vocab`){f=null,p.className=`card`,p.innerHTML=`ตอนนี้แบบฝึกหัดช้อยส์รองรับเฉพาะคำศัพท์ก่อนครับ`,m.innerHTML=``;return}r=t,u=[...i],d=[],H(),z()}function z(){let e=u;if(D.classList.add(`hidden`),T.classList.add(`hidden`),e.length<4){f=null,p.className=`card`,p.textContent=`🎉 ทำแบบฝึกหัดครบแล้ว!`,m.innerHTML=``,D.classList.add(`hidden`),T.classList.add(`hidden`),H();return}let t=r===`mixed`?L():r,n=e[Math.floor(Math.random()*e.length)];f=n,b.classList.remove(`is-flipped`),m.innerHTML=``;let i=Y([n,...Y(e.filter(e=>e.id!==n.id)).slice(0,3)]),a=t===`kanji-to-meaning-reading`?n.kanji:n.reading,o=e=>t===`kanji-to-meaning-reading`?`
        <div class="choice-main">${e.reading}</div>
        <div class="choice-sub">${e.th} / ${e.en}</div>
      `:`
      <div class="choice-main">${e.kanji}</div>
      <div class="choice-sub">${e.th} / ${e.en}</div>
    `;p.className=`card choice-card`,p.innerHTML=`
    <div class="choice-box">
      <div class="choice-question">${a}</div>

      ${i.map(e=>`
            <button class="choice-option" data-id="${e.id}">
              ${o(e)}
            </button>
          `).join(``)}

      <div class="choice-result" id="choiceResult"></div>
    </div>
  `,document.querySelectorAll(`.choice-option`).forEach(e=>{e.onclick=()=>{let t=Number(e.dataset.id),r=document.getElementById(`choiceResult`);document.querySelectorAll(`.choice-option`).forEach(e=>{e.disabled=!0,Number(e.dataset.id)===n.id&&e.classList.add(`correct`)}),t===n.id?r.textContent=`ถูกต้อง 🎉`:(e.classList.add(`wrong`),r.textContent=`ผิดครับ 😢`),D.classList.remove(`hidden`)}})}function B(e){return`
    <div class="answer-card">
      <div class="answer-section answer-head">
        <span class="pill blue">JP</span>
        <div class="jp answer-main-kanji">${e.kanji}</div>
      </div>

      <div class="answer-section">
        <span class="pill pink">READING</span>
        <div class="reading">${e.reading}</div>
      </div>

      <div class="answer-section">
        <span class="pill green">TH / EN</span>
        <div class="th">${e.th}</div>
        <div class="en">${e.en}</div>
      </div>

      <div class="example-box">
        <div class="example-title">ตัวอย่างประโยค</div>
        <div class="jp">${e.example_kanji}</div>
        <div class="kana">${e.example_kana}</div>
        <div class="en">${e.example_en}</div>
        <div class="th">${e.example_th}</div>
      </div>
    </div>
  `}function V(){!f||!n||(m.innerHTML=B(f),b.classList.add(`is-flipped`),D.classList.add(`hidden`),T.classList.remove(`hidden`))}function H(){if(n){if(h.textContent=String(d.length),_.textContent=String(u.length),d.length===0){g.innerHTML=`<div class="empty">ยังไม่มีข้อที่ทำแบบฝึกหัดแล้ว</div>`;return}g.innerHTML=d.map((e,t)=>`
          <div class="guessed-item">
            <div class="guessed-number">${t+1}</div>
            <div>
              <div class="guessed-kanji">${e.kanji}</div>
              <div class="guessed-reading">${e.reading}</div>
              <div class="guessed-meaning">${e.th} / ${e.en}</div>
            </div>
          </div>
        `).join(``);return}let e=I(),t=te();if(h.textContent=String(t.length),_.textContent=String(e.length),t.length===0){g.innerHTML=`<div class="empty">ยังไม่มีข้อที่ทายแล้ว</div>`;return}g.innerHTML=t.map((e,t)=>P(e)?`
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
      `).join(``)}function U(){b.classList.remove(`is-flipped`),x.textContent=`Show`;let n=I();if(H(),n.length===0){f=null,p.className=`card`,p.textContent=`🎉 Done!`,m.innerHTML=`
      <div class="done-box">
        เก่งมาก! ทายครบหมวดนี้แล้ว 🎊
      </div>
    `;return}if(f=n[Math.floor(Math.random()*n.length)],m.innerHTML=``,e===`grammar`){let e=f;t===`jp-to-meaning`?(p.className=`card jp-question`,p.innerHTML=`<div class="jp">${e.example_kanji}</div>`):t===`meaning-to-jp`?(p.className=`card meaning-question`,p.innerHTML=`
        <div class="meaning-question-content">
          <div class="th-question">${e.example_th}</div>
          <div class="en-question">${e.example_en}</div>
        </div>
      `):(p.className=`card reading-question`,p.innerHTML=`<div class="reading">${e.example_kana}</div>`);return}let r=f;t===`jp-to-meaning`?(p.className=`card jp-question`,p.textContent=r.kanji):t===`meaning-to-jp`?(p.className=`card meaning-question`,p.innerHTML=`
      <div class="meaning-question-content">
        <div class="th-question">${r.th}</div>
        <div class="en-question">${r.en}</div>
      </div>
    `):(p.className=`card reading-question`,p.textContent=r.reading)}async function W(){try{let e=await fetch(`/flashcard-n3-vite/vocab.json`),t=await fetch(`/flashcard-n3-vite/grammar.json`);i=await e.json(),a=await t.json(),o={"jp-to-meaning":[...i],"meaning-to-jp":[...i],"reading-to-jp":[...i]},s={"jp-to-meaning":[...a],"meaning-to-jp":[...a],"reading-to-jp":[...a]},U()}catch(e){console.error(`โหลดไฟล์ json ไม่ได้`,e)}}function G(){if(!f||n)return;if(b.classList.contains(`is-flipped`)){b.classList.remove(`is-flipped`),x.textContent=`Show`;return}if(e===`grammar`){let e=f;m.innerHTML=`
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
    `,b.classList.add(`is-flipped`),x.textContent=`Hide`;return}let r=f;t===`jp-to-meaning`?m.innerHTML=`
      <div class="answer-card">
        <div class="answer-section">
          <span class="pill pink">READING</span>
          <div class="reading">${r.reading}</div>
        </div>

        <div class="answer-section">
          <span class="pill blue">EN</span>
          <div class="en">${r.en}</div>
        </div>

        <div class="answer-section">
          <span class="pill green">TH</span>
          <div class="th">${r.th}</div>
        </div>

        <div class="example-box">
          <div class="example-title">ตัวอย่างประโยค</div>
          <div class="jp">${r.example_kanji}</div>
          <div class="kana">${r.example_kana}</div>
          <div class="en">${r.example_en}</div>
          <div class="th">${r.example_th}</div>
        </div>
      </div>
    `:m.innerHTML=`
      <div class="answer-card">
        <div class="answer-section">
          <span class="pill blue">JP</span>
          <div class="jp">${r.kanji}</div>
          <div class="kana">${r.reading}</div>
        </div>

        <div class="answer-section">
          <span class="pill green">TH / EN</span>
          <div class="th">${r.th}</div>
          <div class="en">${r.en}</div>
        </div>

        <div class="example-box">
          <div class="example-title">ตัวอย่างประโยค</div>
          <div class="jp">${r.example_kanji}</div>
          <div class="kana">${r.example_kana}</div>
          <div class="en">${r.example_en}</div>
          <div class="th">${r.example_th}</div>
        </div>
      </div>
    `,b.classList.add(`is-flipped`),x.textContent=`Hide`}function K(){if(n){if(f){let e=f;d.push(e),u=u.filter(t=>t.id!==e.id)}H(),z();return}if(f){if(e===`vocab`){let e=f;c[t].push(e),o[t]=o[t].filter(t=>t.id!==e.id)}else{let e=f;l[t].push(e),s[t]=s[t].filter(t=>t.id!==e.id)}U()}}function q(){if(n){z();return}U()}function J(){if(n){u=[...i],d=[],H(),z();return}e===`vocab`?(o[t]=[...i],c[t]=[]):(s[t]=[...a],l[t]=[]),m.innerHTML=``,U()}function Y(e){return[...e].sort(()=>Math.random()-.5)}function X(e,t){let n=t===`mixed`?[`jp-to-meaning`,`reading-to-jp`,`meaning-to-jp`][Math.floor(Math.random()*3)]:t;return P(e)?n===`jp-to-meaning`?e.kanji:n===`reading-to-jp`?e.reading:`${e.th} / ${e.en}`:n===`jp-to-meaning`?e.example_kanji:n===`reading-to-jp`?e.example_kana:`${e.example_th} / ${e.example_en}`}function Z(e){return P(e)?`
      ${e.kanji}<br/>
      อ่านว่า: ${e.reading}<br/>
      ความหมาย: ${e.th} / ${e.en}<br/>
      ตัวอย่าง: ${e.example_kanji}<br/>
      ${e.example_kana}<br/>
      ${e.example_th} / ${e.example_en}
    `:`
    ${e.grammar}<br/>
    โครงสร้าง: ${e.structure}<br/>
    ความหมาย: ${e.meaning_th} / ${e.meaning_en}<br/>
    ตัวอย่าง: ${e.example_kanji}<br/>
    ${e.example_kana}<br/>
    ${e.example_th} / ${e.example_en}
  `}function ne(){let t=document.getElementById(`exerciseMode`).value,n=Y(e===`vocab`?i:a),r=`
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
        ${n.map((e,n)=>`
        <p>
          ${n+1}. คำถามที่ ${n+1}: 
          ${X(e,t)}
          ........................................
        </p>
      `).join(``)}

        <div class="page-break"></div>

        <h1>เฉลย</h1>
        ${n.map((e,t)=>`
        <p>
          ${t+1}. ${Z(e)}
        </p>
      `).join(``)}
      </body>
    </html>
  `,o=new Blob([r],{type:`application/msword;charset=utf-8`}),s=URL.createObjectURL(o),c=document.createElement(`a`);c.href=s,c.download=`N3-exercise.doc`,c.click(),URL.revokeObjectURL(s)}x.onclick=G,S.onclick=K,C.onclick=q,ee.onclick=J,T.onclick=K,E.onclick=J,D.onclick=V,document.getElementById(`downloadExerciseBtn`).onclick=ne,document.querySelectorAll(`input[name="mode"]`).forEach(e=>{e.addEventListener(`change`,()=>{t=e.value,m.innerHTML=``,U()})}),document.querySelectorAll(`input[name="category"]`).forEach(t=>{t.addEventListener(`change`,()=>{e=t.value,m.innerHTML=``,U()})});function Q(){let e=y.classList.contains(`hidden`)?`History`:`ซ่อน History`;v.textContent=e,O.textContent=e}function $(){y.classList.toggle(`hidden`),Q()}v.onclick=$,O.onclick=$,M.onclick=()=>{F(`flashcard`),U()},N.onclick=()=>{F(`quiz`),p.className=`card`,p.innerHTML=`กรุณาเลือกแบบ Quiz`,m.innerHTML=``,D.classList.add(`hidden`),T.classList.add(`hidden`)},w.onclick=()=>{F(`flashcard`),U()},document.getElementById(`quizMode`).onchange=()=>{R()},W();