/**
 * Sequence:
 * 1. Tap love
 * 2. Rose blooms (~2.7s)
 * 3. CSS starts message grow on top (delayed until bloom finishes)
 */
(function () {
  "use strict";

  const intro = document.getElementById("intro");
  const reveal = document.getElementById("reveal");
  const loveBtn = document.getElementById("love-btn");
  const flower = document.getElementById("flower");
  const petalsLayer = document.getElementById("petals");
  if (!loveBtn || !intro || !reveal || !flower) return;

  let opened = false;

  const setAppHeight = () => {
    const h = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;
    document.documentElement.style.setProperty("--app-height", h + "px");
  };

  setAppHeight();
  window.addEventListener("resize", setAppHeight, { passive: true });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(setAppHeight, 120);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setAppHeight, {
      passive: true,
    });
  }

  const spawnPetals = (count) => {
    if (!petalsLayer) return;
    const isPhone = window.innerWidth < 480;
    const n = isPhone ? Math.min(count, 8) : count;

    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "petal-fall";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 3.2 + Math.random() * 3 + "s";
      p.style.animationDelay = Math.random() * 0.9 + "s";
      p.style.width = 8 + Math.random() * 9 + "px";
      p.style.height = 11 + Math.random() * 11 + "px";
      p.style.opacity = String(0.45 + Math.random() * 0.35);
      petalsLayer.appendChild(p);
      window.setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 8500);
    }
  };

  const openLove = () => {
    if (opened) return;
    opened = true;

    intro.classList.add("is-leaving");
    loveBtn.disabled = true;
    loveBtn.setAttribute("aria-disabled", "true");

    if (navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch (_) {
        /* ignore */
      }
    }

    window.setTimeout(() => {
      intro.hidden = true;
      intro.style.display = "none";
      reveal.hidden = false;
      reveal.classList.add("is-visible");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          /* Step 1: bloom 3D rose (message CSS waits --bloom-done) */
          flower.classList.add("is-open");
          reveal.classList.add("is-open");
          void flower.offsetWidth;

          spawnPetals(12);
          const rain = window.setInterval(() => spawnPetals(2), 1400);
          window.setTimeout(() => window.clearInterval(rain), 7000);
        });
      });
    }, 420);
  };

  loveBtn.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      openLove();
    },
    { passive: false }
  );

  loveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openLove();
  });

  loveBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLove();
    }
  });
})();
