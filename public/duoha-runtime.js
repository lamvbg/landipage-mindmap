
document.addEventListener('DOMContentLoaded', function(){

  const base = '/mindmap/gallery/';

  const galleries = [
    { number:'01', title:'Claymation Style', type:'Claymation',
      files:['clay-1.png','clay-2.png','clay-3.png'] },
    { number:'02', title:'Isometric Diorama Style', type:'Isometric',
      files:['isometric-1.png','isometric-2.png','isometric-3.png'] },
    { number:'03', title:'Voxel Style', type:'Voxel',
      files:['voxel-1.png','voxel-2.png','voxel-3.png'] },
    { number:'04', title:'Carved Relief Style', type:'Relief',
      files:['relief-1.png','relief-2.png','relief-3.png'] }
  ];


  const root = document.getElementById('edGalleryRows');
  if(!root) return;


  /* =====================================================
     CREATE EACH GALLERY
  ====================================================== */
  galleries.forEach((g,galleryIndex)=>{

    const row = document.createElement('section');
    row.className = 'ed-row';

    row.innerHTML = `
      <div class="ed-row-head">

        <div class="ed-row-title">
          <span class="ed-row-number">${g.number}</span>
          <h3>${g.title}</h3>
        </div>

        <div class="ed-browse">
          CLICK ARROWS TO BROWSE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"/>
            <path d="m14 7 5 5-5 5"/>
          </svg>
        </div>

      </div>

      <div class="ed-stage">

        <button class="ed-arrow ed-prev"
                type="button"
                aria-label="Previous ${g.title}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m15 5-7 7 7 7"/>
          </svg>
        </button>

        <div class="ed-viewport">
          <div class="ed-track"></div>
        </div>

        <button class="ed-arrow ed-next"
                type="button"
                aria-label="Next ${g.title}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m9 5 7 7-7 7"/>
          </svg>
        </button>

      </div>
    `;

    root.appendChild(row);


    const track = row.querySelector('.ed-track');
    const prev  = row.querySelector('.ed-prev');
    const next  = row.querySelector('.ed-next');
    const view  = row.querySelector('.ed-viewport');


    /* ===================== SLIDE BUILDER ===================== */
    function slide(file,index){

      const el = document.createElement('div');
      el.className = 'ed-slide';

      el.innerHTML = `
        <div class="ed-frame">

          <span class="ed-corner ed-c1"></span>
          <span class="ed-corner ed-c2"></span>
          <span class="ed-corner ed-c3"></span>
          <span class="ed-corner ed-c4"></span>

          <div class="ed-art">
            <img
              src="${base + file}"
              alt="${g.title} example ${index}"
              loading="lazy"
              draggable="false"
            >
          </div>

          <span class="ed-plate">
            ${g.type} / ${String(index).padStart(2,'0')}
          </span>

        </div>
      `;

      return el;
    }


    const originals = g.files.map((file,i)=>slide(file,i+1));
    const cloneCount = Math.min(3,originals.length);

    originals.slice(-cloneCount)
      .forEach(el=>track.appendChild(el.cloneNode(true)));

    originals.forEach(el=>track.appendChild(el));

    originals.slice(0,cloneCount)
      .forEach(el=>track.appendChild(el.cloneNode(true)));


    let index = cloneCount;
    let locked = false;
    let visible = false;
    let pauseHintsUntil = 0;


    function gap(){
      return parseFloat(getComputedStyle(track).gap) || 18;
    }

    function step(){
      const s = track.querySelector('.ed-slide');
      return s ? s.getBoundingClientRect().width + gap() : 0;
    }

    function draw(animate=true,offset=0){

      track.style.transition = animate
        ? 'transform .62s cubic-bezier(.22,.78,.22,1)'
        : 'none';

      track.style.transform =
        `translate3d(${-(index * step() + offset)}px,0,0)`;
    }


    requestAnimationFrame(()=>draw(false));


    /* ===================== NEXT / PREV ===================== */
    function move(direction){

      if(locked) return;

      locked = true;
      pauseHintsUntil = Date.now() + 7000;

      index += direction;
      draw(true);
    }

    next.addEventListener('click',()=>move(1));
    prev.addEventListener('click',()=>move(-1));


    /* ===================== SEAMLESS INFINITE ===================== */
    track.addEventListener('transitionend',()=>{

      if(index >= cloneCount + originals.length){
        index = cloneCount;
        draw(false);
      }

      if(index < cloneCount){
        index = cloneCount + originals.length - 1;
        draw(false);
      }

      locked = false;
    });


    /* =====================================================
       SNEAK PEEK
       small slide to reveal there is MORE content
    ====================================================== */
    function sneakPeek(){

      if(!visible || locked || Date.now() < pauseHintsUntil) return;

      const amount = window.innerWidth < 700 ? 28 : 52;

      draw(true,amount);

      setTimeout(()=>{
        if(Date.now() >= pauseHintsUntil){
          draw(true,0);
        }
      },720);
    }


    const observer = new IntersectionObserver(entries=>{

      entries.forEach(entry=>{

        visible = entry.isIntersecting;

        if(entry.isIntersecting){
          setTimeout(sneakPeek,700 + galleryIndex * 220);
        }

      });

    },{
      threshold:.35
    });

    observer.observe(row);


    /* subtle reminder every few seconds */
    setInterval(sneakPeek,8500 + galleryIndex * 400);


    /* ===================== SWIPE ===================== */
    let startX = null;

    view.addEventListener('pointerdown',e=>{
      startX = e.clientX;
      pauseHintsUntil = Date.now() + 7000;
      view.setPointerCapture?.(e.pointerId);
    });

    view.addEventListener('pointerup',e=>{

      if(startX === null) return;

      const diff = e.clientX - startX;

      if(Math.abs(diff) > 55){
        move(diff < 0 ? 1 : -1);
      }

      startX = null;
    });


    /* ===================== KEYBOARD ===================== */
    row.tabIndex = 0;

    row.addEventListener('keydown',e=>{

      if(e.key === 'ArrowRight'){
        e.preventDefault();
        move(1);
      }

      if(e.key === 'ArrowLeft'){
        e.preventDefault();
        move(-1);
      }

    });


    /* ===================== RESIZE ===================== */
    let rt;

    window.addEventListener('resize',()=>{

      clearTimeout(rt);

      rt = setTimeout(()=>{
        draw(false);
      },120);

    });

  });

});


/* ---- next script ---- */


// TRUE PANORAMIC 3D FLIPBOOK ENGINE
class PanoramicBook {
    constructor(rootId, images) {
        this.root = document.getElementById(rootId);
        if (!this.root) return;

        this.images = images;
        this.idx = 0;
        this.isFlipping = false;

        this.bgTargets = this.root.querySelectorAll('.pano-bg-target');
        this.bgNexts = this.root.querySelectorAll('.pano-bg-next');
        this.flipper = this.root.querySelector('.pano-flipper');
        this.bookElement = this.root.querySelector('.pano-book');

        const section = this.root.closest('.spec-frame') || this.root.closest('[data-tab-panel]') || this.root.closest('section');
        this.counter = section ? section.querySelector('.pano-counter') : null;
        this.prevBtn = section ? section.querySelector('.pano-prev') : null;
        this.nextBtn = section ? section.querySelector('.pano-next') : null;

        this.init();
        this.bindEvents();
    }

    init() {
        this.setImages(this.bgTargets, this.images[0]);
        if (this.images.length > 1) {
            this.setImages(this.bgNexts, this.images[1]);
        }
        this.updateUI();
    }

    setImages(elements, src) {
        elements.forEach(el => {
            el.style.backgroundImage = `url('${src}')`;
        });
    }

    updateUI() {
        if (this.counter) {
            this.counter.textContent = this.idx === 0 ? 'COVER AND BACK COVER' : `PAGE ${this.idx} / ${this.images.length - 1}`;
        }

        if (this.idx === 0) {
            this.bookElement.classList.remove('is-inner');
        } else {
            this.bookElement.classList.add('is-inner');
        }

        if (this.prevBtn) this.prevBtn.disabled = (this.idx === 0);
        if (this.nextBtn) this.nextBtn.disabled = (this.idx === this.images.length - 1);
    }

    bindEvents() {
        this.root.addEventListener('click', (e) => {
            const rect = this.root.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            if (clickX < rect.width / 2) {
                this.prev();
            } else {
                this.next();
            }
        });

        if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
        if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });
    }

    next() {
        if (this.isFlipping || this.idx >= this.images.length - 1) return;
        this.isFlipping = true;
        this.flipper.classList.remove('idle');

        this.bookElement.classList.add('is-inner');

        const nextIdx = this.idx + 1;
        this.setImages(this.bgNexts, this.images[nextIdx]);

        this.flipper.classList.add('turned');

        setTimeout(() => {
            this.idx = nextIdx;
            this.setImages(this.bgTargets, this.images[this.idx]);

            this.flipper.style.transition = 'none';
            this.flipper.classList.remove('turned');

            requestAnimationFrame(() => {
                this.flipper.style.transition = '';
                this.isFlipping = false;
                this.updateUI();
                this.flipper.classList.add('idle');
            });
        }, 900);
    }

    prev() {
        if (this.isFlipping || this.idx <= 0) return;
        this.isFlipping = true;
        this.flipper.classList.remove('idle');

        const prevIdx = this.idx - 1;

        this.setImages(this.bgNexts, this.images[this.idx]);
        this.setImages(this.bgTargets, this.images[prevIdx]);

        this.flipper.style.transition = 'none';
        this.flipper.classList.add('turned');

        requestAnimationFrame(() => {
            this.flipper.style.transition = '';
            this.flipper.classList.remove('turned');

            setTimeout(() => {
                this.idx = prevIdx;
                this.isFlipping = false;
                this.updateUI();
                this.flipper.classList.add('idle');
            }, 900);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const base = '/mindmap/flip';

    const fotoImages = [`${base}/foto/cover.png`];
    for (let i = 1; i <= 32; i++) fotoImages.push(`${base}/foto/${i}.png`);

    const kartunImages = [`${base}/kartun/cover.png`];
    for (let i = 1; i <= 32; i++) kartunImages.push(`${base}/kartun/${i}.png`);

    const bwImages = [`${base}/bw/cover.png`];
    for (let i = 1; i <= 31; i++) bwImages.push(`${base}/bw/${i}.png`);

    new PanoramicBook('book-foto', fotoImages);
    new PanoramicBook('book-kartun', kartunImages);
    new PanoramicBook('book-bw', bwImages);
});

// Style tab switcher (Interactive Preview)
function switchStyleTab(key) {
    document.querySelectorAll('.style-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.getAttribute('data-tab-panel') === key);
    });
    document.querySelectorAll('.style-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab-btn') === key);
    });
}

// FAQ accordion
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}


/* ---- next script ---- */


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-gallery]').forEach(group => {
        const track = group.querySelector('[data-gallery-track]');
        const prev = group.querySelector('[data-gallery-prev]');
        const next = group.querySelector('[data-gallery-next]');
        if (!track) return;
        const step = () => Math.min(track.clientWidth * 0.78, 640);
        if (prev) prev.addEventListener('click', () => track.scrollBy({left:-step(), behavior:'smooth'}));
        if (next) next.addEventListener('click', () => track.scrollBy({left:step(), behavior:'smooth'}));
    });

    // small keyboard quality-of-life improvement for focused flipbooks
    document.querySelectorAll('.pano-stage').forEach(stage => {
        stage.setAttribute('tabindex','0');
        stage.setAttribute('role','button');
        stage.setAttribute('aria-label','Interactive experiment book preview. Use left and right arrow keys to turn pages.');
        stage.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') { e.preventDefault(); stage.click(); }
        });
    });
});


/* ---- next script ---- */


(function () {
  'use strict';
  // One fixed deadline worldwide — the honest "launch price ends" date.
  // >>> SET THIS TO YOUR REAL price-increase date and actually honor it. <<<
  const deadline = Date.parse('2026-10-05T23:59:59+07:00');
  const timers = Array.from(document.querySelectorAll('[data-closing-countdown]'));
  let interval;
  function updateCountdown() {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      timers.forEach(function (timer) { timer.hidden = true; });
      clearInterval(interval);
      return;
    }
    const total = Math.ceil(remaining / 1000);
    const values = {days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60};
    timers.forEach(function (timer) {
      timer.querySelectorAll('[data-closing-unit]').forEach(function (field) {
        field.textContent = String(values[field.dataset.closingUnit]).padStart(2, '0');
      });
      timer.hidden = false;
    });
  }
  updateCountdown();
  if (Date.now() < deadline) interval = setInterval(updateCountdown, 1000);
  document.addEventListener('visibilitychange', updateCountdown);
  window.addEventListener('pageshow', updateCountdown);
})();

/* ==== ENH: income calculator + sticky buy ==== */
(function(){
  function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }
  var root = document.querySelector('[data-enh-calc]');
  if (root) {
    var books = root.querySelector('[data-calc-books]');
    var price = root.querySelector('[data-calc-price]');
    var sales = root.querySelector('[data-calc-sales]');
    function upd(){
      var b=+books.value, p=+price.value, sl=+sales.value, month=b*p*sl;
      root.querySelector('[data-calc-books-out]').textContent=b;
      root.querySelector('[data-calc-price-out]').textContent=p;
      root.querySelector('[data-calc-sales-out]').textContent=sl;
      root.querySelector('[data-calc-month]').textContent=money(month);
      root.querySelector('[data-calc-year]').textContent=money(month*12);
    }
    [books,price,sales].forEach(function(el){ if(el) el.addEventListener('input', upd); });
    upd();
  }
  var sticky = document.querySelector('[data-enh-sticky]');
  if (sticky) {
    var show = function(){
      if (window.scrollY > 700) { sticky.style.opacity='1'; sticky.style.transform='translateY(0)'; }
      else { sticky.style.opacity='0'; sticky.style.transform='translateY(6rem)'; }
    };
    window.addEventListener('scroll', show, {passive:true}); show();
  }
})();


/* ==== ENH: exit-intent free-sample popup ==== */
(function(){
  var ov = document.getElementById('enh-exit');
  if(!ov) return;
  var KEY='mvk_exit_shown', armed=false;
  setTimeout(function(){ armed=true; }, 4000);
  function open(){ if(!armed || sessionStorage.getItem(KEY)) return; sessionStorage.setItem(KEY,'1'); ov.style.display='flex'; ov.classList.remove('hidden'); }
  function close(){ ov.style.display='none'; }
  document.addEventListener('mouseout', function(e){ if(!e.relatedTarget && e.clientY <= 0) open(); });
  ov.addEventListener('click', function(e){ if(e.target===ov || (e.target.closest && e.target.closest('[data-exit-close]'))) close(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
})();
