const nav = document.getElementById('nav');
const burger = document.getElementById('navBurger');
const navLinks = document.querySelector('.nav-links');

// Scroll: add .scrolled class
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile burger
burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  // Toggle menu-open on nav so backdrop-filter is removed while menu is visible.
  // backdrop-filter creates a stacking context that traps position:fixed children,
  // causing the overlay to be clipped to the nav bar when scrolled.
  nav.classList.toggle('menu-open', isOpen);
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    nav.classList.remove('menu-open');
  });
});

const caseVideo = document.getElementById('caseVideo');

    if (caseVideo) {
      let manuallyPaused = false;

      // Track if user manually paused via controls
      caseVideo.addEventListener('pause', () => {
        // Only flag as manual if the video is still in view (not our observer pausing it)
        if (!caseVideo._observerPausing) {
          manuallyPaused = true;
        }
      });

      caseVideo.addEventListener('play', () => {
        manuallyPaused = false;
      });

      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // In view — autoplay unless user manually paused
            if (!manuallyPaused) {
              caseVideo.play().catch(() => { });
            }
          } else {
            // Out of view — pause silently
            caseVideo._observerPausing = true;
            caseVideo.pause();
            caseVideo._observerPausing = false;
          }
        });
      }, {
        threshold: 0.4  // 40% visible before it starts
      });

      videoObserver.observe(caseVideo);
    }

    const fadeImages = document.querySelectorAll(".fade-media");

fadeImages.forEach(img => {
  if (img.complete) {
    img.classList.add("loaded");
  } else {
    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });
  }
});