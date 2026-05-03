const nav = document.getElementById('nav');
const burger = document.getElementById('navBurger');
const navLinks = document.querySelector('.nav-links');

// Scroll: add .scrolled class
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile burger
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
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

 // Fade-in images
    document.querySelectorAll('.fade-media').forEach(img => {
      if (img.complete) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'));
    });

    // ── Thumb video: hover = play/pause (desktop) | scroll-to-play (mobile) ──
    const thumbVideos = document.querySelectorAll('.cs-reel-thumb');
    const modal      = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn   = document.getElementById('videoClose');

    // True on phones/tablets — devices with no hover and a coarse pointer (finger)
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    thumbVideos.forEach(video => {
      if (isTouchDevice) {
        // Mobile: autoplay muted when scrolled into view, pause when out
        const thumbObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
              video.currentTime = 0;
            }
          });
        }, { threshold: 0.5 });
        thumbObserver.observe(video);
      } else {
        // Desktop: hover play / pause
        video.addEventListener('mouseenter', () => video.play());
        video.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
      }

      // Click → open modal with sound (both mobile and desktop)
      video.addEventListener('click', () => {
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('show'));
        modalVideo.src = video.src;
        modalVideo.currentTime = 0;
        modalVideo.muted = false;
        modalVideo.play().catch(() => {});
      });
    });

    // Close modal — pause instantly, hide after fade, clear src last
    function closeModal() {
      modalVideo.pause();
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        modalVideo.removeAttribute('src');
        modalVideo.load();
      }, 320);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

     // Fade-in images on load
    document.querySelectorAll('.fade-media').forEach(img => {
      if (img.complete) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'));
    });

    // ── Gallery ──────────────────────────────────────────
    const track       = document.getElementById('galleryTrack');
    const dotsWrap    = document.getElementById('galleryDots');
    const slides      = Array.from(track.querySelectorAll('.cs-gallery-slide'));
    const total       = slides.length;
    let current       = 0;
    let autoTimer     = null;
    let isTransitioning = false;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'cs-gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });

    function getDots() { return dotsWrap.querySelectorAll('.cs-gallery-dot'); }

    function goTo(index, instant = false) {
      if (isTransitioning && !instant) return;
      current = ((index % total) + total) % total;

      // CSS transform slide
      if (instant) track.style.transition = 'none';
      else         track.style.transition = 'transform 0.65s cubic-bezier(0.77, 0, 0.18, 1)';

      track.style.transform = `translateX(-${current * 100}%)`;

      // Dots
      getDots().forEach((d, i) => d.classList.toggle('active', i === current));

      // Progress bar restart
      document.getElementById('galleryProgress').style.transition = 'none';
      document.getElementById('galleryProgress').style.width = '0%';
      if (!instant) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          document.getElementById('galleryProgress').style.transition = 'width 5s linear';
          document.getElementById('galleryProgress').style.width = '100%';
        }));
      }

      isTransitioning = true;
      setTimeout(() => { isTransitioning = false; }, 680);
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 10000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // Prev / Next
    document.getElementById('galleryPrev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    document.getElementById('galleryNext').addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Pause on hover / touch
    const gallery = document.querySelector('.cs-gallery');
    gallery.addEventListener('mouseenter', () => clearInterval(autoTimer));
    gallery.addEventListener('mouseleave', () => startAuto());
    gallery.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true });
    gallery.addEventListener('touchend',   () => { resetAuto(); }, { passive: true });

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
    });

    // Kick off
    goTo(0, true);
    startAuto();