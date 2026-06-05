(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[],t=[],n=[],r=null,i=document.getElementById(`question`),a=document.getElementById(`answer`),o=document.getElementById(`guessedCount`),s=document.getElementById(`guessedList`),c=document.getElementById(`remainCount`);`serviceWorker`in navigator&&navigator.serviceWorker.register(`/flashcard-n3-vite/sw.js`);function l(){if(o.textContent=String(n.length),c.textContent=String(t.length),n.length===0){s.innerHTML=`<div class="empty">ยังไม่มีคำที่ทายแล้ว</div>`;return}s.innerHTML=n.map((e,t)=>`
      <div class="guessed-item">
        <div class="guessed-number">${t+1}</div>
        <div>
          <div class="guessed-kanji">${e.kanji}</div>
          <div class="guessed-meaning">${e.th} / ${e.en}</div>
        </div>
      </div>
    `).join(``)}function u(){if(l(),t.length===0){r=null,i.textContent=`🎉 Done!`,a.innerHTML=`
      <div class="done-box">
        เก่งมาก! ทายครบทั้งหมดแล้ว 🎊
      </div>
    `;return}r=t[Math.floor(Math.random()*t.length)],i.textContent=r.kanji,a.innerHTML=``}async function d(){try{e=await(await fetch(`/flashcard-n3-vite/vocab.json`)).json(),t=[...e],n=[],u()}catch(e){console.error(`โหลด vocab.json ไม่ได้`,e)}}function f(){r&&(a.innerHTML=`
    <div class="answer-card">
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
  `)}function p(){r&&(n.push(r),t=t.filter(e=>e.id!==r.id),u())}function m(){u()}function h(){t=[...e],n=[],u()}document.getElementById(`showBtn`).onclick=f,document.getElementById(`nextBtn`).onclick=p,document.getElementById(`skipBtn`).onclick=m,document.getElementById(`restartBtn`).onclick=h,d();