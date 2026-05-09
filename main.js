/* =============================================================
   BIRTHDAY WEBSITE — main.js
   =============================================================

   OBSAH:
   1. Animácia hviezd (canvas)
   1.5 Padajúce hviezdy
   2. Vlastný kurzor
   3. Parallax & scroll reveal
   4. Navigačné bodky
   5. Galéria — stagger efekt
   6. Lightbox
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   1. ANIMÁCIA HVIEZD
───────────────────────────────────────────────────────────── */

const starsCanvas = document.getElementById('starsCanvas');
const starsCtx = starsCanvas.getContext('2d');

let stars = [];
const shootingStars = [];

/* Farba hviezd */
const STAR_COLOR = '210, 175, 255';

/* Hustota hviezd */
const STAR_DENSITY = 6000;


/* ─────────────────────────────────────────────────────────────
   Inicializácia hviezd
───────────────────────────────────────────────────────────── */

function initStars() {

  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;

  stars = [];

  const count = Math.floor(
    (starsCanvas.width * starsCanvas.height) / STAR_DENSITY
  );

  for (let i = 0; i < count; i++) {

    stars.push({
      x: Math.random(),
      y: Math.random(),

      r: Math.random() * 1.3 + 0.2,

      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.8,

      opacity: Math.random() * 0.6 + 0.1
    });
  }
}


/* ─────────────────────────────────────────────────────────────
   PADAJÚCE HVIEZDY
───────────────────────────────────────────────────────────── */

function createShootingStar() {

  const startX = Math.random() * starsCanvas.width;
  const startY = Math.random() * starsCanvas.height * 0.45;

  shootingStars.push({

    x: startX,
    y: startY,

    length: 90 + Math.random() * 120,

    speed: 7 + Math.random() * 5,

    life: 0,
    maxLife: 65 + Math.random() * 30,

    opacity: 0.18 + Math.random() * 0.22
  });
}


function animateShootingStars() {

  for (let i = shootingStars.length - 1; i >= 0; i--) {

    const s = shootingStars[i];

    s.x += s.speed;
    s.y += s.speed * 0.55;

    s.life++;

    const alpha =
      s.opacity * (1 - s.life / s.maxLife);

    const gradient = starsCtx.createLinearGradient(
      s.x,
      s.y,
      s.x - s.length,
      s.y - s.length * 0.55
    );

    gradient.addColorStop(
      0,
      `rgba(${STAR_COLOR}, ${alpha})`
    );

    gradient.addColorStop(
      1,
      `rgba(${STAR_COLOR}, 0)`
    );

    starsCtx.beginPath();

    starsCtx.strokeStyle = gradient;
    starsCtx.lineWidth = 1.2;

    starsCtx.moveTo(s.x, s.y);

    starsCtx.lineTo(
      s.x - s.length,
      s.y - s.length * 0.55
    );

    starsCtx.stroke();

    if (s.life >= s.maxLife) {
      shootingStars.splice(i, 1);
    }
  }
}


/* ─────────────────────────────────────────────────────────────
   HLAVNÁ ANIMÁCIA CANVASU
───────────────────────────────────────────────────────────── */

function animateStars(timestamp) {

  starsCtx.clearRect(
    0,
    0,
    starsCanvas.width,
    starsCanvas.height
  );

  /* Klasické hviezdy */
  stars.forEach(star => {

    const alpha =
      star.opacity *
      (
        0.4 +
        0.6 *
        (
          0.5 +
          0.5 *
          Math.sin(
            timestamp *
            star.speed *
            0.0008 +
            star.phase
          )
        )
      );

    starsCtx.beginPath();

    starsCtx.arc(
      star.x * starsCanvas.width,
      star.y * starsCanvas.height,
      star.r,
      0,
      Math.PI * 2
    );

    starsCtx.fillStyle =
      `rgba(${STAR_COLOR}, ${alpha.toFixed(3)})`;

    starsCtx.fill();
  });

  /* Shooting stars */
  animateShootingStars();

  requestAnimationFrame(animateStars);
}


/* ─────────────────────────────────────────────────────────────
   Náhodné spawnovanie padajúcich hviezd
───────────────────────────────────────────────────────────── */

function randomShootingStarLoop() {

  createShootingStar();

  const nextDelay =
    5000 + Math.random() * 9000;

  setTimeout(
    randomShootingStarLoop,
    nextDelay
  );
}


/* Inicializácia */
initStars();

window.addEventListener(
  'resize',
  initStars
);

requestAnimationFrame(animateStars);

/* prvá shooting star */
setTimeout(
  randomShootingStarLoop,
  3500
);


/* ─────────────────────────────────────────────────────────────
   2. VLASTNÝ KURZOR
───────────────────────────────────────────────────────────── */

const cursorDot = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;

const RING_LERP = 0.12;


document.addEventListener('mousemove', e => {

  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});


function animateCursor() {

  ringX += (mouseX - ringX) * RING_LERP;
  ringY += (mouseY - ringY) * RING_LERP;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();


const hoverTargets = document.querySelectorAll(
  'a, .gallery-item, .nav-dot, .lightbox-close, button'
);

hoverTargets.forEach(el => {

  el.addEventListener(
    'mouseenter',
    () => cursorRing.classList.add('hover')
  );

  el.addEventListener(
    'mouseleave',
    () => cursorRing.classList.remove('hover')
  );
});


/* ─────────────────────────────────────────────────────────────
   3. PARALLAX & SCROLL REVEAL
───────────────────────────────────────────────────────────── */

const parallaxEl =
  document.querySelector('.parallax-slow');

const REVEAL_THRESHOLD = 0.88;
const PARALLAX_SPEED = 0.15;


function onScroll() {

  const scrollY = window.scrollY;

  if (parallaxEl) {
    parallaxEl.style.transform =
      `translateY(${scrollY * PARALLAX_SPEED}px)`;
  }

  updateNavDots();
  revealElements();
}

window.addEventListener(
  'scroll',
  onScroll,
  { passive: true }
);


/* ─────────────────────────────────────────────────────────────
   4. NAVIGAČNÉ BODKY
───────────────────────────────────────────────────────────── */

const allSections =
  document.querySelectorAll('section');

const navDots =
  document.querySelectorAll('.nav-dot');


function updateNavDots() {

  let currentSection = 'hero';

  allSections.forEach(sec => {

    const rect = sec.getBoundingClientRect();

    if (rect.top <= window.innerHeight * 0.4) {
      currentSection = sec.id;
    }
  });

  navDots.forEach(dot => {

    dot.classList.toggle(
      'active',
      dot.dataset.section === currentSection
    );
  });
}


navDots.forEach(dot => {

  dot.addEventListener('click', () => {

    const target =
      document.getElementById(dot.dataset.section);

    if (target) {

      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});


/* ─────────────────────────────────────────────────────────────
   5. GALÉRIA — STAGGER REVEAL
───────────────────────────────────────────────────────────── */

const galleryItems =
  document.querySelectorAll('.gallery-item');

const GALLERY_DELAY_STEP = 0.08;

galleryItems.forEach((item, index) => {

  item.style.transitionDelay =
    (index * GALLERY_DELAY_STEP) + 's';
});


/* ─────────────────────────────────────────────────────────────
   REVEAL ELEMENTS
───────────────────────────────────────────────────────────── */

function revealElements() {

  document
    .querySelectorAll('.reveal:not(.visible)')
    .forEach(el => {

      const rect = el.getBoundingClientRect();

      if (
        rect.top <
        window.innerHeight * REVEAL_THRESHOLD
      ) {
        el.classList.add('visible');
      }
    });
}

setTimeout(revealElements, 100);


/* ─────────────────────────────────────────────────────────────
   6. LIGHTBOX
───────────────────────────────────────────────────────────── */

function openLightbox(itemEl) {

  const label =
    itemEl.dataset.label || 'Fotografia';

  const caption =
    itemEl.dataset.caption || '';

  lightboxLabel.textContent = label;
  lightboxCaption.textContent = caption;

  const img = itemEl.querySelector('img');

  const existingImg =
    lightboxImgWrap.querySelector('img');

  if (existingImg) existingImg.remove();

  if (img && img.src) {

    const lightboxImg =
      document.createElement('img');

    lightboxImg.src = img.src;
    lightboxImg.alt = label;

    lightboxImgWrap.appendChild(lightboxImg);
  }

  lightbox.classList.add('open');

  document.body.style.overflow = 'hidden';
}


function closeLightbox() {

  lightbox.classList.remove('open');

  document.body.style.overflow = '';
}


lightboxClose.addEventListener(
  'click',
  closeLightbox
);


lightbox.addEventListener('click', e => {

  if (e.target === lightbox) {
    closeLightbox();
  }
});


document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    closeLightbox();
  }
});


window.openLightbox = openLightbox;
