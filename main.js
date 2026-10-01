const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#nav-links");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!reduceMotion && finePointer) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      if (card.classList.contains("hero-photo-card")) {
        card.style.transform = `rotateX(${3 - y * 7}deg) rotateY(${-10 + x * 12}deg) rotateZ(${-2 + x * 2}deg)`;
      } else {
        card.style.transform = `rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-3px)`;
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("transform");
    });
  });
}
