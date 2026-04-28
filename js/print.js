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