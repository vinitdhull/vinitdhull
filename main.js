/**
 * VINIT KUMAR DHULL — INTERACTION & MOTION SYSTEM
 * Senior Technology Leadership Portfolio
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Remove no-js and mark ready
  document.documentElement.classList.remove("no-js");

  // 2. Dynamic Year
  const currentYearEl = document.querySelector("#current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 3. Header & Scroll Progress
  const header = document.querySelector("#header");
  const scrollProgressBar = document.querySelector("#scroll-progress");

  let isScrollScheduled = false;

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header styling
    if (header) {
      if (scrollY > 24) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Scroll progress bar
    if (scrollProgressBar) {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    isScrollScheduled = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!isScrollScheduled) {
        window.requestAnimationFrame(handleScroll);
        isScrollScheduled = true;
      }
    },
    { passive: true },
  );

  handleScroll();

  // 4. Mobile Navigation Drawer
  const menuToggle = document.querySelector("#menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function closeMobileNav() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
  }

  function openMobileNav() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileNav();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMobileNav();
        menuToggle.focus();
      }
    });
  }

  // 5. Active Section Scrollspy
  const navAnchors = document.querySelectorAll(".desktop-nav .nav-anchor");
  const observedSections = document.querySelectorAll("main > section[id]");

  if (navAnchors.length > 0 && observedSections.length > 0 && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            navAnchors.forEach((anchor) => {
              const href = anchor.getAttribute("href");
              if (href === `#${currentId}`) {
                anchor.classList.add("active");
              } else {
                anchor.classList.remove("active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      },
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  // 6. Interactive Projects Carousel
  const carouselTrack = document.querySelector("#projects-carousel");
  const prevBtn = document.querySelector("#carousel-prev");
  const nextBtn = document.querySelector("#carousel-next");
  const currentCountEl = document.querySelector("#carousel-current");
  const totalCountEl = document.querySelector("#carousel-total");
  const progressBarThumb = document.querySelector("#carousel-progress-bar");
  const slides = document.querySelectorAll(".carousel-slide");

  if (carouselTrack && slides.length > 0) {
    const totalSlides = slides.length;
    if (totalCountEl) totalCountEl.textContent = totalSlides;

    function getSlideWidth() {
      const firstSlide = slides[0];
      const gap = 20; // Matches css gap
      return firstSlide ? firstSlide.offsetWidth + gap : 360;
    }

    function updateCarouselStatus() {
      const scrollLeft = carouselTrack.scrollLeft;
      const slideWidth = getSlideWidth();
      const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;

      // Calculate approximate current slide index (1-indexed)
      let activeIndex = Math.round(scrollLeft / slideWidth) + 1;
      activeIndex = Math.max(1, Math.min(totalSlides, activeIndex));

      if (currentCountEl) {
        currentCountEl.textContent = activeIndex;
      }

      // Update progress bar
      if (progressBarThumb) {
        const progressFraction = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const maxTranslate = (totalSlides - 1) * 100; // in percent
        progressBarThumb.style.transform = `translateX(${progressFraction * maxTranslate}%)`;
      }

      // Button states
      if (prevBtn) {
        prevBtn.disabled = scrollLeft <= 10;
      }
      if (nextBtn) {
        nextBtn.disabled = scrollLeft >= maxScroll - 10;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        carouselTrack.scrollBy({
          left: -getSlideWidth(),
          behavior: "smooth",
        });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        carouselTrack.scrollBy({
          left: getSlideWidth(),
          behavior: "smooth",
        });
      });
    }

    // Keyboard support on carousel
    carouselTrack.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        carouselTrack.scrollBy({ left: -getSlideWidth(), behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        carouselTrack.scrollBy({ left: getSlideWidth(), behavior: "smooth" });
      }
    });

    // Touch & scroll listener
    let carouselScrollTicking = false;
    carouselTrack.addEventListener(
      "scroll",
      () => {
        if (!carouselScrollTicking) {
          window.requestAnimationFrame(() => {
            updateCarouselStatus();
            carouselScrollTicking = false;
          });
          carouselScrollTicking = true;
        }
      },
      { passive: true },
    );

    // Initial update
    updateCarouselStatus();
    window.addEventListener("resize", updateCarouselStatus, { passive: true });
  }

  // 7. Clipboard Copy for Contact Email
  const copyBtn = document.querySelector("#copy-email-btn");
  const toast = document.querySelector("#toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    const toastMessage = document.querySelector("#toast-message");
    if (toastMessage && message) {
      toastMessage.textContent = message;
    }
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toast.setAttribute("aria-hidden", "true");
    }, 3200);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const emailToCopy = copyBtn.getAttribute("data-email") || "dhullvinit15@gmail.com";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback
          const tempInput = document.createElement("input");
          tempInput.value = emailToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }
        showToast("Email address copied to clipboard!");
      } catch (err) {
        showToast("Email: " + emailToCopy);
      }
    });
  }

  // 8. Motion & Scroll-triggered reveals
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-ready");

    const revealSelectors = [
      ".hero-content > *",
      ".proof-metric-card",
      ".about-narrative-column > *",
      ".pillar-card",
      ".featured-case-card",
      ".editorial-project-card",
      ".carousel-section-wrapper",
      ".product-app-card",
      ".dossier-card",
      ".timeline-row",
      ".credential-box-recognition",
      ".credential-box-education",
      ".contact-box-content > *",
    ];

    const targets = document.querySelectorAll(revealSelectors.join(", "));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    targets.forEach((target, index) => {
      target.setAttribute("data-reveal", "");
      // Stagger within small local groups
      target.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
      revealObserver.observe(target);
    });
  }

  // 9. Interactive 3D Card Tilt (fine pointer only)
  if (!reduceMotion && finePointer) {
    const tiltCards = document.querySelectorAll("[data-tilt]");

    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (card.classList.contains("hero-visual-stage")) {
          const frame = card.querySelector(".stage-frame-outer");
          if (frame) {
            frame.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
          }
        } else {
          card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-3px)`;
        }
      });

      card.addEventListener("pointerleave", () => {
        if (card.classList.contains("hero-visual-stage")) {
          const frame = card.querySelector(".stage-frame-outer");
          if (frame) {
            frame.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0px)";
          }
        } else {
          card.style.transform = "none";
        }
      });
    });
  }
});
