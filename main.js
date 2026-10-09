/**
 * VINIT KUMAR DHULL — INTERACTION & 3D MOTION SYSTEM
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
      const gap = 20;
      return firstSlide ? firstSlide.offsetWidth + gap : 360;
    }

    function updateCarouselStatus() {
      const scrollLeft = carouselTrack.scrollLeft;
      const slideWidth = getSlideWidth();
      const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;

      let activeIndex = Math.round(scrollLeft / slideWidth) + 1;
      activeIndex = Math.max(1, Math.min(totalSlides, activeIndex));

      if (currentCountEl) {
        currentCountEl.textContent = activeIndex;
      }

      if (progressBarThumb) {
        const progressFraction = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const maxTranslate = (totalSlides - 1) * 100;
        progressBarThumb.style.transform = `translateX(${progressFraction * maxTranslate}%)`;
      }

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

    carouselTrack.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        carouselTrack.scrollBy({ left: -getSlideWidth(), behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        carouselTrack.scrollBy({ left: getSlideWidth(), behavior: "smooth" });
      }
    });

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
      target.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
      revealObserver.observe(target);
    });
  }

  // =========================================================================
  // 9. 3D HERO ARCHITECTURAL CONSTELLATION & TOPOLOGY CANVAS
  // =========================================================================
  function initHero3DCanvas() {
    const canvas = document.querySelector("#hero-3d-canvas");
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let animationFrameId = null;

    // Mouse Tracking with Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    // 3D Nodes Generation (Distributed in 3D Architectural Shell)
    const NODE_COUNT = 48;
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 180 + Math.random() * 140;

      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: (radius * Math.sin(phi) * Math.sin(theta)) * 0.75, // Elliptical flattening
        z: radius * Math.cos(phi),
        baseRadius: 2.2 + Math.random() * 2.5,
        pulseOffset: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012,
      });
    }

    // Dynamic 3D Packets traveling between nodes
    const packets = [];
    const MAX_PACKETS = 8;
    function spawnPacket() {
      if (packets.length >= MAX_PACKETS) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      // Find nearby node
      const fromNode = nodes[fromIdx];
      let closestIdx = -1;
      let minD = 170;
      for (let j = 0; j < nodes.length; j++) {
        if (j === fromIdx) continue;
        const dx = fromNode.x - nodes[j].x;
        const dy = fromNode.y - nodes[j].y;
        const dz = fromNode.z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minD) {
          minD = dist;
          closestIdx = j;
        }
      }

      if (closestIdx !== -1) {
        packets.push({
          from: fromIdx,
          to: closestIdx,
          progress: 0,
          speed: 0.012 + Math.random() * 0.018,
        });
      }
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    // Mouse Parallax on Hero Section
    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
      heroSection.addEventListener("pointermove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotY = mouseX * 0.55;
        targetRotX = -mouseY * 0.35;
      });

      heroSection.addEventListener("pointerleave", () => {
        targetRotX = 0;
        targetRotY = 0;
      });
    }

    // Visibility Observer
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !animationFrameId) {
          renderLoop();
        }
      }, { threshold: 0.05 });
      observer.observe(canvas.parentElement);
    }

    let time = 0;

    function renderLoop() {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      time += 0.016;

      // Smooth Inertia LERP
      currentRotY += (targetRotY - currentRotY) * 0.04;
      currentRotX += (targetRotX - currentRotX) * 0.04;

      // Base idle rotation + interactive orbit
      const autoRotY = time * 0.15;
      const rotY = autoRotY + currentRotY;
      const rotX = 0.25 + currentRotX;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.58; // Center aligned towards visual hero balance
      const cy = height * 0.5;
      const fov = 420;

      // Project all nodes
      const projected = [];
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // 3D Rotation matrices (Yaw + Pitch)
        const x1 = n.x * cosY + n.z * sinY;
        const z1 = -n.x * sinY + n.z * cosY;
        const y1 = n.y * cosX - z1 * sinX;
        const z2 = n.y * sinX + z1 * cosX;

        // Perspective projection
        const depth = z2 + 350;
        const scale = depth > 0 ? fov / (fov + depth) : 0;
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;
        const alpha = Math.max(0.08, Math.min(0.9, (z2 + 200) / 400));

        projected.push({
          x: px,
          y: py,
          z: z2,
          scale,
          alpha,
          radius: n.baseRadius * scale,
          pulse: Math.sin(time * 3 + n.pulseOffset) * 0.5 + 0.5,
        });
      }

      // Draw Connections (Edges) with 3D Depth
      ctx.lineWidth = 1;
      const maxConnectDist = 135;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < maxConnectDist) {
            const p1 = projected[i];
            const p2 = projected[j];
            const edgeAlpha = (1 - dist3D / maxConnectDist) * Math.min(p1.alpha, p2.alpha) * 0.45;

            if (edgeAlpha > 0.02) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${edgeAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Spawn & Update Packets
      if (Math.random() < 0.08) spawnPacket();
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const p1 = projected[pkt.from];
        const p2 = projected[pkt.to];
        const curX = p1.x + (p2.x - p1.x) * pkt.progress;
        const curY = p1.y + (p2.y - p1.y) * pkt.progress;
        const pAlpha = Math.min(p1.alpha, p2.alpha) * 0.9;

        // Glowing packet head
        ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(56, 189, 248, ${pAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(curX, curY, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (p.alpha <= 0) continue;

        // Outer glow
        const glowRad = p.radius * (1.6 + p.pulse * 0.8);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  // =========================================================================
  // 10. INTERACTIVE 3D BANKING ARCHITECTURE TOPOLOGY CANVAS (SBI)
  // =========================================================================
  function initSBI3DCanvas() {
    const canvas = document.querySelector("#sbi-3d-canvas");
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let animationFrameId = null;

    let rotY = 0.5;
    let rotX = 0.42;
    let targetRotY = 0.5;
    let targetRotX = 0.42;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    function resize() {
      const container = canvas.parentElement;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    // Mouse & Touch Orbit Controls
    const container = canvas.parentElement;
    container.addEventListener("pointerdown", (e) => {
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener("pointermove", (e) => {
      if (isDragging) {
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        targetRotY += dx * 0.012;
        targetRotX = Math.max(0.15, Math.min(0.85, targetRotX + dy * 0.012));
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      }
    });

    function endDrag() {
      isDragging = false;
    }
    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);

    // Hover effect
    container.addEventListener("pointerenter", () => {
      if (!isDragging) targetRotY += 0.2;
    });

    // 3 Architecture Tiers Definition
    const tiers = [
      {
        name: "API GATEWAY LAYER",
        y: -48,
        radius: 65,
        color: "rgba(56, 189, 248, 1)",
        glow: "rgba(56, 189, 248, 0.25)",
        nodes: 6,
      },
      {
        name: "SPRING BOOT MICROSERVICES",
        y: 0,
        radius: 82,
        color: "rgba(59, 130, 246, 1)",
        glow: "rgba(37, 99, 235, 0.3)",
        nodes: 8,
      },
      {
        name: "CORE BANKING SYSTEM (CBS)",
        y: 48,
        radius: 65,
        color: "rgba(16, 185, 129, 1)",
        glow: "rgba(16, 185, 129, 0.25)",
        nodes: 6,
      },
    ];

    // Data flow packets moving up/down the pipeline
    const streamPackets = [
      { tierFrom: 0, tierTo: 1, progress: 0.1, speed: 0.02 },
      { tierFrom: 0, tierTo: 1, progress: 0.6, speed: 0.022 },
      { tierFrom: 1, tierTo: 2, progress: 0.3, speed: 0.018 },
      { tierFrom: 1, tierTo: 2, progress: 0.8, speed: 0.02 },
      { tierFrom: 2, tierTo: 1, progress: 0.45, speed: -0.02 },
      { tierFrom: 1, tierTo: 0, progress: 0.7, speed: -0.022 },
    ];

    // Visibility Observer
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !animationFrameId) {
          renderPipeline();
        }
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    let time = 0;

    function renderPipeline() {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      time += 0.016;
      if (!isDragging) {
        targetRotY += 0.006; // Continuous subtle orbit
      }

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.52;
      const fov = 280;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      function project3D(x, y, z) {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const scale = fov / (fov + z2 + 180);
        return {
          x: cx + x1 * scale,
          y: cy + y1 * scale,
          z: z2,
          scale,
        };
      }

      // Draw Vertical Connecting Architecture Stems
      for (let a = 0; a < 4; a++) {
        const angle = (a * Math.PI) / 2;
        const r = 50;
        const pTop = project3D(Math.cos(angle) * r, tiers[0].y, Math.sin(angle) * r);
        const pBot = project3D(Math.cos(angle) * r, tiers[2].y, Math.sin(angle) * r);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.lineTo(pBot.x, pBot.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Render 3 Tiers (Back to Front or Bottom to Top)
      tiers.forEach((tier) => {
        const vertices = [];
        for (let i = 0; i < tier.nodes; i++) {
          const a = (i * 2 * Math.PI) / tier.nodes;
          const vx = Math.cos(a) * tier.radius;
          const vz = Math.sin(a) * tier.radius;
          vertices.push(project3D(vx, tier.y, vz));
        }

        // Draw Platform Ring
        ctx.strokeStyle = tier.color;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = tier.glow;

        ctx.beginPath();
        for (let i = 0; i < vertices.length; i++) {
          if (i === 0) ctx.moveTo(vertices[i].x, vertices[i].y);
          else ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw Nodes on Ring
        vertices.forEach((v) => {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(v.x, v.y, 2.5 * v.scale, 0, Math.PI * 2);
          ctx.fill();
        });

        // Center Pillar Node
        const centerP = project3D(0, tier.y, 0);
        ctx.fillStyle = tier.color;
        ctx.beginPath();
        ctx.arc(centerP.x, centerP.y, 4 * centerP.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Animated Transaction Packets
      streamPackets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) pkt.progress = 0;
        if (pkt.progress <= 0) pkt.progress = 1;

        const yFrom = tiers[pkt.tierFrom].y;
        const yTo = tiers[pkt.tierTo].y;
        const curY = yFrom + (yTo - yFrom) * Math.abs(pkt.progress);
        const pPkt = project3D(0, curY, 0);

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pPkt.x, pPkt.y, 3.2 * pPkt.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.arc(pPkt.x, pPkt.y, 7 * pPkt.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(renderPipeline);
    }

    renderPipeline();
  }

  // =========================================================================
  // 11. ADVANCED MULTI-LAYER 3D TILT, SPECULAR GLARE & HOLOGRAPHIC PARALLAX
  // =========================================================================
  function initAdvanced3DTilt() {
    if (reduceMotion || !finePointer) return;

    const tiltCards = document.querySelectorAll("[data-tilt]");

    tiltCards.forEach((card) => {
      // Invert / inject 3D specular glare overlay if not present
      if (!card.querySelector(".tilt-glare-wrap")) {
        const glareWrap = document.createElement("div");
        glareWrap.className = "tilt-glare-wrap";
        glareWrap.innerHTML = '<div class="tilt-glare-layer"></div>';
        card.appendChild(glareWrap);
      }

      const glareLayer = card.querySelector(".tilt-glare-layer");
      let bounds = null;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let isHovered = false;
      let tiltAnimId = null;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      function updateCardTransform() {
        if (!isHovered && Math.abs(currentRotX) < 0.05 && Math.abs(currentRotY) < 0.05) {
          if (card.classList.contains("hero-visual-stage")) {
            const frame = card.querySelector(".stage-frame-outer");
            const photo = card.querySelector(".hero-portrait-image");
            if (frame) frame.style.transform = "rotateY(0deg) rotateX(0deg)";
            if (photo) photo.style.transform = "none";
          } else {
            card.style.transform = "none";
          }
          if (glareLayer) glareLayer.style.opacity = "0";
          tiltAnimId = null;
          return;
        }

        // Smooth LERP
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;

        if (card.classList.contains("hero-visual-stage")) {
          const frame = card.querySelector(".stage-frame-outer");
          const photo = card.querySelector(".hero-portrait-image");
          const chipUpper = card.querySelector(".chip-upper");
          const chipLower = card.querySelector(".chip-lower");
          const chipCred = card.querySelector(".chip-cred");

          if (frame) {
            frame.style.transform = `perspective(1000px) rotateY(${currentRotY * 14}deg) rotateX(${-currentRotX * 12}deg) translateZ(10px)`;
          }

          // Counter-depth Parallax on Portrait
          if (photo) {
            photo.style.transform = `translate3d(${-currentRotY * 18}px, ${currentRotX * 14}px, 0) scale(1.06)`;
          }

          // Independent Multi-Plane Depth on Floating Chips
          if (chipUpper) {
            chipUpper.style.transform = `translate3d(${currentRotY * 26}px, ${-currentRotX * 20}px, 45px)`;
          }
          if (chipLower) {
            chipLower.style.transform = `translate3d(${-currentRotY * 22}px, ${currentRotX * 18}px, 35px)`;
          }
          if (chipCred) {
            chipCred.style.transform = `translate3d(${currentRotY * 16}px, ${-currentRotX * 14}px, 30px)`;
          }
        } else {
          card.style.transform = `perspective(1000px) rotateX(${-currentRotX * 7}deg) rotateY(${currentRotY * 7}deg) translateY(-4px) translateZ(8px)`;
        }

        tiltAnimId = window.requestAnimationFrame(updateCardTransform);
      }

      card.addEventListener("pointerenter", () => {
        updateBounds();
        isHovered = true;
        if (glareLayer) glareLayer.style.opacity = "1";
        if (!tiltAnimId) tiltAnimId = window.requestAnimationFrame(updateCardTransform);
      });

      card.addEventListener("pointermove", (e) => {
        if (!bounds) updateBounds();
        const mouseX = (e.clientX - bounds.left) / bounds.width;
        const mouseY = (e.clientY - bounds.top) / bounds.height;

        targetRotX = (mouseY - 0.5) * 2;
        targetRotY = (mouseX - 0.5) * 2;

        // Move Specular Glare
        if (glareLayer) {
          glareLayer.style.transform = `translate(${(mouseX - 0.5) * 120}%, ${(mouseY - 0.5) * 120}%) translate(-50%, -50%)`;
        }
      });

      card.addEventListener("pointerleave", () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        if (glareLayer) glareLayer.style.opacity = "0";
      });
    });
  }

  // =========================================================================
  // 12. 3D MAGNETIC INTERACTIVE BUTTONS
  // =========================================================================
  function initMagneticButtons() {
    if (reduceMotion || !finePointer) return;

    const magneticButtons = document.querySelectorAll(".btn-primary, .btn-secondary, .btn-hero-light");

    magneticButtons.forEach((btn) => {
      btn.classList.add("btn-magnetic");
      let bounds = null;

      btn.addEventListener("pointerenter", () => {
        bounds = btn.getBoundingClientRect();
      });

      btn.addEventListener("pointermove", (e) => {
        if (!bounds) bounds = btn.getBoundingClientRect();
        const x = e.clientX - bounds.left - bounds.width / 2;
        const y = e.clientY - bounds.top - bounds.height / 2;

        // 3D Magnetic displacement
        btn.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 8px) rotateX(${-y * 0.08}deg) rotateY(${x * 0.08}deg)`;
      });

      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "none";
        bounds = null;
      });
    });
  }

  // Initialize All 3D Motion Subsystems
  initHero3DCanvas();
  initSBI3DCanvas();
  initAdvanced3DTilt();
  initMagneticButtons();
});
