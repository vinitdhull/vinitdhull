const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#nav-links");
const progressBar = document.querySelector("#scroll-progress");

function closeNavigation() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeNavigation();
    menuButton.focus();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

let progressUpdateScheduled = false;
function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
  progressUpdateScheduled = false;
}

window.addEventListener("scroll", () => {
  if (!progressUpdateScheduled) {
    window.requestAnimationFrame(updateScrollProgress);
    progressUpdateScheduled = true;
  }
}, { passive: true });
window.addEventListener("resize", updateScrollProgress, { passive: true });
updateScrollProgress();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".about-section > *, .project-card, .capability-card, .timeline-item, .recognition-inner > *, .education-inner > *, .contact-inner > *",
  );

  document.documentElement.classList.add("js-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  revealTargets.forEach((target, index) => {
    target.setAttribute("data-reveal", "");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 65}ms`);
    revealObserver.observe(target);
  });
}

if (!reduceMotion && finePointer) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      if (card.classList.contains("hero-photo-card")) {
        card.style.transform = `rotateX(${2 - y * 5}deg) rotateY(${-7 + x * 9}deg) rotateZ(${-1 + x * 1.5}deg)`;
      } else {
        card.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("transform");
    });
  });
}
