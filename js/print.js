/**
 * print.js — Unified slideshow controller for the Print & Design section.
 *
 * Slides are stacked via position:absolute and shown/hidden via opacity
 * (CSS handles the 0.45s fade transition). The JS only toggles the
 * .active class — no display toggling.
 *
 * Supports two HTML patterns:
 *
 * Pattern A (BestDrive) — controls INSIDE .print-slideshow:
 *   .print-controls > button.prev / button.next
 *   .print-dots     > span  (dots)
 *
 * Pattern B (Bridgestone, PEP) — controls INSIDE .print-slideshow:
 *   button.slide-btn[data-dir="-1"]  ← prev
 *   button.slide-btn[data-dir="1"]   ← next
 *   .slide-dots > span.dot
 */

document.querySelectorAll(".print-slideshow").forEach(slideshow => {
  const slides = slideshow.querySelectorAll(".print-slide");
  if (!slides.length) return;

  let index = 0;

  /* ── Detect pattern ── */
  const prevA = slideshow.querySelector(".print-controls .prev");
  const nextA = slideshow.querySelector(".print-controls .next");
  const dotsA = slideshow.querySelectorAll(".print-dots span");

  const prevB = slideshow.querySelector('.slide-btn[data-dir="-1"]');
  const nextB = slideshow.querySelector('.slide-btn[data-dir="1"]');
  const dotsB = slideshow.querySelectorAll(".slide-dots .dot");

  const prev = prevA || prevB;
  const next = nextA || nextB;
  const dots = dotsA.length ? dotsA : dotsB;

  /* ── Show slide via opacity (CSS fades it) ── */
  function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    slides[i].classList.add("active");
    if (dots[i]) dots[i].classList.add("active");
  }

  /* ── Controls ── */
  if (next) {
    next.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });
  }

  if (prev) {
    prev.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      showSlide(index);
    });
  });

  /* ── Init ── */
  showSlide(index);
});

/* ─── Book viewer — PEP Promo ───────────────────────────────
 * Shows images in pairs (spreads). Clicking next/prev flips
 * a 3-D page over the spine to reveal the next spread.
 * ─────────────────────────────────────────────────────────── */
(function () {
  const pepImages = [
    'images/PepHomeSlide/PEP HOME LEAFLET PRINT-01.jpg',
    'images/PepHomeSlide/PEP HOME LEAFLET PRINT-02.jpg',
    'images/PepHomeSlide/PEP HOME LEAFLET PRINT-03.jpg',
    'images/PepHomeSlide/PEP HOME LEAFLET PRINT-04.jpg',
    'images/PepCellSlide/Screenshot 2026-05-03 124549.png',
    'images/PepCellSlide/Screenshot 2026-05-03 124619.png',
    'images/PepCellSlide/Screenshot 2026-05-03 124644.png',
    'images/PepCellSlide/Screenshot 2026-05-03 124703.png',
    'images/PepCellSlide/Screenshot 2026-05-03 124726.png',
  ];

  // Group into spreads (left page | right page)
  const spreads = [];
  for (let i = 0; i < pepImages.length; i += 2) {
    spreads.push({ left: pepImages[i], right: pepImages[i + 1] || null });
  }

  const bookLeft     = document.getElementById('bookLeft');
  if (!bookLeft) return; // not on this page

  const bookRight    = document.getElementById('bookRight');
  const bookRightPg  = bookRight.parentElement;
  const flipperFwd   = document.getElementById('bookFlipperFwd');
  const flipperBwd   = document.getElementById('bookFlipperBwd');
  const flipFwdFront = document.getElementById('flipFwdFront');
  const flipFwdBack  = document.getElementById('flipFwdBack');
  const flipBwdFront = document.getElementById('flipBwdFront');
  const flipBwdBack  = document.getElementById('flipBwdBack');
  const prevBtn      = document.getElementById('bookPrev');
  const nextBtn      = document.getElementById('bookNext');
  const counter      = document.getElementById('bookCounter');

  let current    = 0;
  let isFlipping = false;

  function resetFlipper(flipper, front, back) {
    front.src = '';
    back.src  = '';
    flipper.style.animation = 'none';
    void flipper.offsetWidth; // force reflow so animation resets cleanly
    flipper.style.animation  = '';
    flipper.classList.remove('flip');
  }

  function updateUI() {
    counter.textContent  = `${current + 1} / ${spreads.length}`;
    prevBtn.disabled     = current === 0;
    nextBtn.disabled     = current === spreads.length - 1;
  }

  function setStaticPages(idx) {
    const s = spreads[idx];
    bookLeft.src         = s.left;
    bookRight.src        = s.right || '';
    bookRightPg.style.opacity = s.right ? '1' : '0';
  }

  /* ── Forward: right page flips left over the spine ── */
  function goForward() {
    if (isFlipping || current >= spreads.length - 1) return;
    isFlipping = true;

    const curr = spreads[current];
    const next = spreads[current + 1];

    flipFwdFront.src     = curr.right || '';   // page that flips away
    flipFwdBack.src      = next.left;           // page revealed on back
    bookRight.src        = next.right || '';    // pre-load next right (under flipper)
    bookRightPg.style.opacity = next.right ? '1' : '0';

    flipperFwd.classList.add('flip');

    flipperFwd.addEventListener('animationend', function handler() {
      flipperFwd.removeEventListener('animationend', handler);
      current++;
      bookLeft.src = spreads[current].left; // settle left page
      resetFlipper(flipperFwd, flipFwdFront, flipFwdBack);
      updateUI();
      isFlipping = false;
    }, { once: true });
  }

  /* ── Backward: left page flips right over the spine ── */
  function goBackward() {
    if (isFlipping || current <= 0) return;
    isFlipping = true;

    const curr = spreads[current];
    const prev = spreads[current - 1];

    flipBwdFront.src     = curr.left;            // page that flips away
    flipBwdBack.src      = prev.right || '';      // page revealed on back
    bookLeft.src         = prev.left;             // pre-load prev left (under flipper)

    flipperBwd.classList.add('flip');

    flipperBwd.addEventListener('animationend', function handler() {
      flipperBwd.removeEventListener('animationend', handler);
      current--;
      bookRight.src        = spreads[current].right || '';
      bookRightPg.style.opacity = spreads[current].right ? '1' : '0';
      resetFlipper(flipperBwd, flipBwdFront, flipBwdBack);
      updateUI();
      isFlipping = false;
    }, { once: true });
  }

  nextBtn.addEventListener('click', goForward);
  prevBtn.addEventListener('click', goBackward);

  // Init
  setStaticPages(0);
  updateUI();
}());