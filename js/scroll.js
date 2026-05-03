// Intersection Observer for scroll reveal
const revealEls = document.querySelectorAll(
  '.about-grid, .about-heading, .work-header, .case-card, .grid-item, ' +
  '.award-year-block, .contact-heading, .reel-hero, .reel-item, .contact-links'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => observer.observe(el));

// Stagger children of work-grid and reel-grid
document.querySelectorAll('.work-grid .grid-item, .reel-grid .reel-item, .work-featured .case-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});

const heroVideo = document.querySelector(".reel-hero-video");

const VideoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      heroVideo.play();
    } else {
      heroVideo.pause();
    }
  });
}, { threshold: 0.6 });

VideoObserver.observe(heroVideo);

const thumbVideos = document.querySelectorAll(".reel-thumb-video");

const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

thumbVideos.forEach(video => {
  if (isTouchDevice) {
    // Mobile: autoplay muted when scrolled into view, pause when out
    const thumbObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.setAttribute('playsinline', '');
          if (video.preload !== 'auto') {
            video.preload = 'auto';
            video.load();
          }
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }, { threshold: 0.3 });
    thumbObserver.observe(video);
  } else {
    // Desktop: hover play / pause
    video.addEventListener("mouseenter", () => video.play());
    video.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  }
});
const modal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const closeBtn = document.getElementById("videoClose");

// Open modal
thumbVideos.forEach(video => {
  video.addEventListener("click", () => {
    modal.style.display = "flex";
    modalVideo.src = video.src;
    modalVideo.currentTime = 0;
    modalVideo.muted = false; 
    modalVideo.play();
    modal.classList.add("show");
    modal.style.display = "flex";
  });
});

const allVideos = document.querySelectorAll(".reel-thumb-video, .reel-hero-video");

allVideos.forEach(video => {
  video.addEventListener("click", () => {
    modal.style.display = "flex";
    modalVideo.src = video.src;
    modalVideo.currentTime = 0;
    modalVideo.muted = false;
    modalVideo.play();
    modal.classList.add("show");
    modal.style.display = "flex";
  });
});

// Close with X button
closeBtn.addEventListener("click", () => {
  closeModal();
});

// Close when clicking background ONLY
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.style.display = "none";
  modalVideo.pause();
  modalVideo.src = "";
}

const heroImg = document.querySelector(".hero-portrait");

if (heroImg) {
  const container = heroImg.parentElement;

  if (heroImg.complete) {
    heroImg.classList.add("loaded");
    container.classList.add("loaded");
  } else {
    heroImg.addEventListener("load", () => {
      heroImg.classList.add("loaded");
      container.classList.add("loaded");
    });
  }
}