(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[],t=null,n=document.getElementById(`question`),r=document.getElementById(`answer`);`serviceWorker`in navigator&&navigator.serviceWorker.register(`/flashcard-n3-vite/sw.js`);function i(){if(e.length===0){n.textContent=`🎉 Done!`,r.innerHTML=``;return}t=e[Math.floor(Math.random()*e.length)],n.textContent=t.kanji,r.innerHTML=``}async function a(){try{e=await(await fetch(`/flashcard-n3-vite/vocab.json`)).json(),i()}catch(e){console.error(`โหลด vocab.json ไม่ได้`,e)}}function o(){t&&(r.innerHTML=`
    <div class="box">
      <div class="label">EN</div>
      <div class="en">${t.en}</div>
    </div>

    <div class="box">
      <div class="label">TH</div>
      <div class="th">${t.th}</div>
    </div>

    <div class="box">
      <div class="label">EXAMPLE (JP)</div>
      <div class="jp">${t.example_kanji}</div>
    </div>

    <div class="box">
      <div class="kana">${t.example_kana}</div>
    </div>

    <div class="box">
      <div class="en">${t.example_en}</div>
    </div>

    <div class="box">
      <div class="th">${t.example_th}</div>
    </div>
  `)}function s(){t&&(e=e.filter(e=>e.id!==t.id),i())}function c(){i()}function l(){a()}document.getElementById(`showBtn`).onclick=o,document.getElementById(`nextBtn`).onclick=s,document.getElementById(`skipBtn`).onclick=c,document.getElementById(`restartBtn`).onclick=l,a();