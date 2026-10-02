/* ════════════════════════════════════════════════════════════════════
   EIPI — Homepage extension sections
   Ports of the otis-valen + blunt-main motion systems: work-items
   fly-ins, services stacking pins, testimonial card scatter, 3D
   contact-card flips, and the Matter.js physics footer. Heavy choreography
   runs only on desktop + motion-allowed (gsap.matchMedia); everything
   else stays static and fully legible. Initialization waits for the
   hero reveal so all measurements are taken after the entrance settles.
   ════════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  const initLenis = () => {
    if (lenis || !window.Lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis; // exposed for tooling / devtools
  };

  /* ---------- Sticky header (compacts on scroll, hides at the footer) ---------- */
  let showHeaderFn = null;
  const initStickyHeader = () => {
    const header = $(".header");
    const footer = $("footer.site-footer");
    if (!header) return;

    let lastY = (lenis ? lenis.scroll : window.scrollY) || 0;
    let scrollDirection = 1; // 1 = scrolling down, -1 = scrolling up
    let isHidden = false;

    const hideHeader = () => {
      if (isHidden) return;
      isHidden = true;
      header.classList.add("is-hidden");
      const h = header.offsetHeight || 80;
      gsap.to(header, {
        y: -(h + 6),
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const showHeader = () => {
      if (!isHidden) return;
      isHidden = false;
      header.classList.remove("is-hidden");
      gsap.to(header, {
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    showHeaderFn = showHeader;

    const updateHeader = () => {
      const sy = lenis ? lenis.scroll : window.scrollY;
      const maxScroll = lenis ? lenis.limit : (document.documentElement.scrollHeight - window.innerHeight);
      const isAtBottom = sy >= (maxScroll - 10);
      const delta = sy - lastY;
      lastY = sy;

      // Track scroll direction: ignore micro-jitter and rubber-band bounce at page bottom
      if (delta < -1.5 && !isAtBottom) {
        scrollDirection = -1; // user is deliberately scrolling UP
      } else if (delta > 1.5) {
        scrollDirection = 1;  // user is scrolling DOWN
      }

      // Compact header when scrolled down past hero top margin
      header.classList.toggle("is-scrolled", sy > 24);

      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const footerHeight = footer.offsetHeight || 1;
        const footerEntered = (window.innerHeight - footerTop) / footerHeight;

        // When reaching ~20% of footer:
        // If scrolling UP, slide down into view smoothly
        // If scrolling DOWN into footer, slide up out of view smoothly
        if (footerEntered >= 0.20) {
          if (scrollDirection === -1) {
            showHeader();
          } else {
            hideHeader();
          }
        } else {
          // Above 20% of footer: always visible
          showHeader();
        }
      } else {
        showHeader();
      }
    };

    if (lenis) {
      lenis.on("scroll", updateHeader);
    } else {
      window.addEventListener("scroll", updateHeader, { passive: true });
    }
    updateHeader();
  };

  /* ---------- Smooth anchor navigation (offset by sticky header) ---------- */
  const initAnchors = () => {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      const headerEl = $(".header");
      if (showHeaderFn) {
        showHeaderFn();
      } else if (headerEl) {
        headerEl.classList.remove("is-hidden");
      }

      // Close dropdown if open
      const openDropdown = $(".nav-dropdown-wrap.is-open");
      if (openDropdown) openDropdown.classList.remove("is-open");

      // Back to Top button / #hero / #top
      if (hash === "#hero" || hash === "#top" || a.classList.contains("footer-top-btn")) {
        if (lenis) {
          lenis.scrollTo(0, {
            duration: 1.4,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      // If anchor carries a category filter for the portfolio section
      const cat = a.getAttribute("data-category");
      if (cat && typeof window.__applyWorkFilter === "function") {
        window.__applyWorkFilter(cat);
      }

      const offset = -(headerEl ? headerEl.offsetHeight : 0);
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.35,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          offset,
        });
      } else {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY + offset,
          behavior: "smooth",
        });
      }
    });
  };

  /* ---------- Nav Dropdown Interaction (Mobile toggle, Escape, Click Outside) ---------- */
  const initNavDropdown = () => {
    const wrap = $(".nav-dropdown-wrap");
    const trigger = $(".nav-item-dropdown");
    if (!wrap || !trigger) return;

    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 900 || ("ontouchstart" in window)) {
        if (!wrap.classList.contains("is-open")) {
          e.preventDefault();
          wrap.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        wrap.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  };

  /* ---------- Masked reveals (hero reveal language, scroll-driven) ---------- */
  const initReveals = () => {
    $$("[data-o-reveal]").forEach((el) => {
      gsap.set(el, { yPercent: 118 });
      gsap.to(el, {
        yPercent: 0,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    $$("[data-o-scale]").forEach((el) => {
      gsap.set(el, { scale: 0 });
      gsap.to(el, {
        scale: 1,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  };

  /* ---------- 01 · Works Filter & Catalog (bymonolog-style) ---------- */
  let workFilterCleanup = null;
  const initWorkFilter = () => {
    if (workFilterCleanup) {
      workFilterCleanup();
      workFilterCleanup = null;
    }

    const section = $(".work-section");
    if (!section) return;

    const filterBtns = $$(".work-filter-btn", section);
    const cards = $$(".work-card", section);

    const applyFilter = (filterCategory) => {
      filterBtns.forEach((btn) => {
        const isActive = btn.getAttribute("data-filter") === filterCategory;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      const cardsToAnimateIn = [];

      cards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category") || "";
        const categories = cardCategory.split(/\s+/);
        const match = filterCategory === "all" || categories.includes(filterCategory);

        if (match) {
          card.classList.remove("is-hidden");
          cardsToAnimateIn.push(card);
        } else {
          card.classList.add("is-hidden");
        }
      });

      if (cardsToAnimateIn.length > 0) {
        gsap.fromTo(
          cardsToAnimateIn,
          { opacity: 0, y: 20, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.04,
            ease: "power3.out",
            overwrite: "auto",
          },
        );
      }

      // Re-calculate page scroll boundaries
      ScrollTrigger.refresh();
    };
    window.__applyWorkFilter = applyFilter;

    const onBtnClick = (e) => {
      const btn = e.currentTarget;
      const filter = btn.getAttribute("data-filter");
      if (filter) applyFilter(filter);
    };

    filterBtns.forEach((btn) => btn.addEventListener("click", onBtnClick));

    workFilterCleanup = () => {
      filterBtns.forEach((btn) => btn.removeEventListener("click", onBtnClick));
    };
  };

  /* ---------- 08 · Testimonials (blunt-main card stack port) ---------- */
  const TESTI_REST = [
    { x: -260, y: 16, r: -8 },
    { x: -90, y: -12, r: 5 },
    { x: 95, y: 10, r: -4 },
    { x: 265, y: -8, r: 9 },
  ];

  const TESTI_BIAS = [
    { x: 1.05, y: 6, r: -2 },
    { x: 0.9, y: -5, r: 3 },
    { x: 1.1, y: 7, r: -3 },
    { x: 0.95, y: -4, r: 2 },
  ];

  let testiCleanup = null;

  const initTestimonials = () => {
    const section = $(".testimonials");
    const cards = $$(".testi-card", section);
    if (!section || cards.length < 2) return;

    let activeIndex = null;
    let introDone = false;
    const enterFns = [];
    let leaveFn = null;

    const getPoses = (active) => {
      if (active === null) return TESTI_REST;
      return TESTI_REST.map((pose, i) => {
        if (i === active) {
          return {
            x: pose.x,
            y: pose.y - 8,
            r: pose.r * 0.4,
          };
        }
        const dir = i < active ? -1 : 1;
        const dist = Math.abs(i - active);
        const bias = TESTI_BIAS[i];
        const push = (95 + dist * 28) * bias.x;
        return {
          x: pose.x + dir * push,
          y: pose.y + bias.y * dist * 0.5,
          r: pose.r + bias.r * dist * 1.0,
        };
      });
    };

    const moveTo = (poses) => {
      if (!introDone) return;
      cards.forEach((el, i) => {
        gsap.to(el, {
          x: poses[i].x,
          y: poses[i].y,
          rotation: poses[i].r,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
          force3D: true,
        });
      });
    };

    const scatter = (index) => {
      if (index === activeIndex) return;
      activeIndex = index;
      moveTo(getPoses(index));
    };

    const isOverCard = (node) =>
      node instanceof Element &&
      cards.some((card) => card === node || card.contains(node));

    leaveFn = (e) => {
      if (isOverCard(e.relatedTarget)) return;
      scatter(null);
    };

    cards.forEach((el, i) => {
      enterFns[i] = () => scatter(i);
      el.addEventListener("mouseenter", enterFns[i]);
      el.addEventListener("mouseleave", leaveFn);
    });

    const INTRO_Y = Math.max(window.innerHeight * 0.75, 600);
    cards.forEach((el, i) => {
      gsap.set(el, {
        x: TESTI_REST[i].x,
        y: TESTI_REST[i].y + INTRO_Y,
        rotation: TESTI_REST[i].r,
        zIndex: i + 1,
        xPercent: -50,
        yPercent: -50,
        force3D: true,
      });
    });

    const introTl = gsap.timeline({
      paused: true,
      onComplete: () => {
        introDone = true;
      },
    });
    cards.forEach((el, i) => {
      introTl.to(
        el,
        {
          y: TESTI_REST[i].y,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        },
        i * 0.1,
      );
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => introTl.play(),
    });

    testiCleanup = () => {
      cards.forEach((el, i) => {
        if (enterFns[i]) el.removeEventListener("mouseenter", enterFns[i]);
        if (leaveFn) el.removeEventListener("mouseleave", leaveFn);
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "transform, zIndex" });
      });
      introTl.kill();
    };
  };

  /* ---------- 03 · Spotlight (blunt Spotlight port) ---------- */
  const SPOT_FINAL_POSITIONS = [
    [-34, -25], // Top-left [x(vw), y(vh)]
    [33, -23],  // Top-right [x(vw), y(vh)]
    [-33, 26],  // Bottom-left [x(vw), y(vh)]
    [34, 25],   // Bottom-right [x(vw), y(vh)]
  ];
  const SPOT_INITIAL_ROTATIONS = [5, -3, 3.5, -4.5];
  const SPOT_FINAL_ROTATIONS = [-3.5, 3, -2.5, 3.5];
  const SPOT_PHASE_ONE_STARTS = [0, 0.1, 0.2, 0.3];
  const SPOT_PHASE_TWO_STARTS = [0.5, 0.55, 0.6, 0.65];

  const spotEaseOutCubic = (value) => 1 - Math.pow(1 - value, 3);

  const spotGetPhaseProgress = (progress, start, end) => {
    if (progress >= end) return 1;
    if (progress < start) return 0;
    return spotEaseOutCubic((progress - start) / (end - start));
  };

  let spotlightTrigger = null;

  const initSpotlight = () => {
    const section = $(".spotlight");
    const images = $$(".spot-image", section);
    if (!section || images.length < 2) return;

    section.classList.add("is-spot");

    images.forEach((image, index) => {
      gsap.set(image, {
        transform: `translate3d(calc(-50% + 0vw), calc(-50% + 100vh), 0) rotate(${SPOT_INITIAL_ROTATIONS[index]}deg)`,
        force3D: true,
        willChange: "transform",
      });
    });

    spotlightTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * 6}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        images.forEach((image, index) => {
          const initialRotation = SPOT_INITIAL_ROTATIONS[index];
          const finalRotation = SPOT_FINAL_ROTATIONS[index] ?? 0;
          const phase1Start = SPOT_PHASE_ONE_STARTS[index];
          const phase1End = Math.min(
            phase1Start + (0.45 - phase1Start) * 0.9,
            0.45,
          );

          let xOffset = 0;
          let yOffset = 100;
          let rotation = initialRotation;

          if (progress < phase1Start) {
            yOffset = 100;
            rotation = initialRotation;
          } else if (progress <= 0.45) {
            const phase1Progress = spotGetPhaseProgress(
              progress,
              phase1Start,
              phase1End,
            );
            yOffset = 100 * (1 - phase1Progress);
            rotation = initialRotation;
          } else if (progress < SPOT_PHASE_TWO_STARTS[index]) {
            xOffset = 0;
            yOffset = 0;
            rotation = initialRotation;
          }

          const phase2Start = SPOT_PHASE_TWO_STARTS[index];
          const phase2End = Math.min(
            phase2Start + (0.88 - phase2Start) * 0.9,
            0.88,
          );
          const finalX = SPOT_FINAL_POSITIONS[index][0];
          const finalY = SPOT_FINAL_POSITIONS[index][1];

          if (progress >= phase2Start && progress <= 0.88) {
            const phase2Progress = spotGetPhaseProgress(
              progress,
              phase2Start,
              phase2End,
            );

            xOffset = finalX * phase2Progress;
            yOffset = finalY * phase2Progress;
            rotation =
              initialRotation + (finalRotation - initialRotation) * phase2Progress;
          } else if (progress > 0.88) {
            xOffset = finalX;
            yOffset = finalY;
            rotation = finalRotation;
          }

          gsap.set(image, {
            transform: `translate3d(calc(-50% + ${xOffset}vw), calc(-50% + ${yOffset}vh), 0) rotate(${rotation}deg)`,
            force3D: true,
          });
        });
      },
    });
  };

  /* ---------- 05 · Stats cards (blunt Stats port) ---------- */
  let statsCardsTween = null;

  const initStatsCards = () => {
    const grid = $(".statscards-grid");
    const cards = $$(".sc-card", grid);
    if (!grid || !cards.length) return;

    gsap.set(cards, {
      rotationX: -90,
      transformOrigin: "50% 0%",
      transformPerspective: 1200,
      force3D: true,
    });

    statsCardsTween = gsap.to(cards, {
      rotationX: 0,
      duration: 1.05,
      ease: "power3.out",
      stagger: {
        each: 0.12,
        from: "start",
      },
      overwrite: "auto",
      paused: true,
    });

    ScrollTrigger.create({
      trigger: grid,
      start: "top 95%",
      once: true,
      onEnter: () => statsCardsTween.play(),
    });
  };

  /* ---------- 05 · What We Make (Showcase Slider) ---------- */
  let wmSliderCleanup = null;

  const initWhatWeMakeSlider = () => {
    const section = document.getElementById("featured");
    if (!section) return;

    const slides = Array.from(section.querySelectorAll(".wm-slide"));
    const prevBtn = section.querySelector("#wmPrevBtn");
    const nextBtn = section.querySelector("#wmNextBtn");
    const counter = section.querySelector("#wmCounter");
    const caption = section.querySelector("#wmCaption");
    const subtitle = section.querySelector("#wmSubtitle");
    const wrapper = section.querySelector(".wm-slider-wrapper");

    if (!slides.length) return;

    let currentIndex = 0;
    let isAnimating = false;
    const totalSlides = slides.length;

    const pad = (n) => String(n).padStart(2, "0");

    const updateCounter = (index) => {
      if (counter) {
        counter.textContent = `${pad(index + 1)} / ${pad(totalSlides)}`;
      }
    };

    // Ensure initial state
    slides.forEach((slide, i) => {
      if (i === 0) {
        slide.classList.add("is-active");
        gsap.set(slide, { opacity: 1, visibility: "visible", xPercent: 0, scale: 1, zIndex: 2 });
      } else {
        slide.classList.remove("is-active");
        gsap.set(slide, { opacity: 0, visibility: "hidden", xPercent: 100, scale: 1, zIndex: 1 });
      }
    });
    updateCounter(0);

    const goToSlide = (newIndex, direction = 1) => {
      if (isAnimating || newIndex === currentIndex) return;

      // Handle wrapping
      if (newIndex < 0) newIndex = totalSlides - 1;
      if (newIndex >= totalSlides) newIndex = 0;

      isAnimating = true;

      const currSlide = slides[currentIndex];
      const nextSlide = slides[newIndex];
      const currImg = currSlide.querySelector(".wm-slide-img");
      const nextImg = nextSlide.querySelector(".wm-slide-img");
      const newTitle = nextSlide.getAttribute("data-title") || "";
      const newSubtitle = nextSlide.getAttribute("data-subtitle") || "";

      // Ensure next slide starts flush off-screen at full opacity with subtle counter-parallax
      nextSlide.classList.add("is-active");
      gsap.set(nextSlide, {
        xPercent: direction > 0 ? 100 : -100,
        opacity: 1,
        visibility: "visible",
        zIndex: 3,
      });
      if (nextImg) {
        gsap.set(nextImg, {
          xPercent: direction > 0 ? -25 : 25,
          scale: 1.06,
        });
      }
      gsap.set(currSlide, { zIndex: 2, opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          currSlide.classList.remove("is-active");
          gsap.set(currSlide, {
            visibility: "hidden",
            opacity: 0,
            xPercent: 0,
            zIndex: 1,
          });
          if (currImg) gsap.set(currImg, { xPercent: 0, scale: 1 });
          gsap.set(nextSlide, { zIndex: 2 });
          currentIndex = newIndex;
          isAnimating = false;
        },
      });

      // Silky smooth full-width displacement without opacity gaps
      tl.to(
        currSlide,
        {
          xPercent: direction > 0 ? -100 : 100,
          duration: 0.8,
          ease: "power3.inOut",
        },
        0,
      );

      if (currImg) {
        tl.to(
          currImg,
          {
            xPercent: direction > 0 ? 25 : -25,
            duration: 0.8,
            ease: "power3.inOut",
          },
          0,
        );
      }

      tl.to(
        nextSlide,
        {
          xPercent: 0,
          duration: 0.8,
          ease: "power3.inOut",
        },
        0,
      );

      if (nextImg) {
        tl.to(
          nextImg,
          {
            xPercent: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.inOut",
          },
          0,
        );
      }

      // Elegant seamless text transition with gentle drift
      const textElements = [caption, subtitle].filter(Boolean);
      if (textElements.length) {
        tl.to(
          textElements,
          {
            opacity: 0,
            y: direction > 0 ? -12 : 12,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
              if (caption) caption.innerHTML = newTitle;
              if (subtitle) subtitle.textContent = newSubtitle;
              updateCounter(newIndex);
              gsap.set(textElements, { y: direction > 0 ? 12 : -12 });
            },
          },
          0,
        );

        tl.to(
          textElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: "power2.out",
          },
          0.32,
        );
      } else {
        updateCounter(newIndex);
      }
    };

    const handlePrev = () => goToSlide(currentIndex - 1, -1);
    const handleNext = () => goToSlide(currentIndex + 1, 1);

    if (prevBtn) prevBtn.addEventListener("click", handlePrev);
    if (nextBtn) nextBtn.addEventListener("click", handleNext);

    // Touch swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
    };

    const handleTouchMove = (e) => {
      if (!e.touches || !e.touches[0]) return;
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    if (wrapper) {
      wrapper.addEventListener("touchstart", handleTouchStart, { passive: true });
      wrapper.addEventListener("touchmove", handleTouchMove, { passive: true });
      wrapper.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    // Keyboard navigation when section in view
    const handleKeyDown = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
      if (!inView) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    wmSliderCleanup = () => {
      if (prevBtn) prevBtn.removeEventListener("click", handlePrev);
      if (nextBtn) nextBtn.removeEventListener("click", handleNext);
      if (wrapper) {
        wrapper.removeEventListener("touchstart", handleTouchStart);
        wrapper.removeEventListener("touchmove", handleTouchMove);
        wrapper.removeEventListener("touchend", handleTouchEnd);
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  };

  /* ---------- 08 · Method Stack (1-by-1 Card Stack with ScrollTrigger) ---------- */
  let methodStackTrigger = null;

  const initMethodStack = () => {
    const section = document.getElementById("method");
    if (!section) return;

    const stackContainer = section.querySelector(".method-cards-stack");
    const cards = Array.from(section.querySelectorAll(".method-stack-card"));
    if (!stackContainer || cards.length < 2) return;

    if (methodStackTrigger) {
      methodStackTrigger.kill();
      methodStackTrigger = null;
    }

    const HEADER_HEIGHT = 72;

    // Dynamically calculate bottom offset guaranteed to be well below the viewport on all screen sizes
    const getOffscreenY = () => {
      const rect = stackContainer.getBoundingClientRect();
      const stackTop = rect.top > 0 ? rect.top : window.innerHeight * 0.25;
      return Math.max(window.innerHeight - stackTop + 400, window.innerHeight + 200);
    };

    // Card 0 starts visible at y = 0
    gsap.set(cards[0], {
      y: 0,
      opacity: 1,
      zIndex: 1,
      force3D: true,
    });

    // Subsequent cards start completely below the screen, 100% opaque
    for (let i = 1; i < cards.length; i++) {
      gsap.set(cards[i], {
        y: getOffscreenY(),
        opacity: 1,
        zIndex: i + 1,
        force3D: true,
        willChange: "transform",
      });
    }

    const tl = gsap.timeline();

    // Each card flies up from the literal bottom of the screen into its stacked position
    for (let i = 1; i < cards.length; i++) {
      const card = cards[i];
      const targetY = i * HEADER_HEIGHT;

      tl.fromTo(
        card,
        {
          y: () => getOffscreenY(),
          opacity: 1,
          force3D: true,
        },
        {
          y: targetY,
          opacity: 1,
          ease: "power2.out",
          duration: 1,
          force3D: true,
        },
        (i - 1) * 1.15,
      );
    }

    // Comfortable resting pause after all cards are stacked so the full deck sits cleanly
    tl.to({}, { duration: 0.6 });

    methodStackTrigger = ScrollTrigger.create({
      animation: tl,
      trigger: section,
      start: "top top",
      end: () => `+=${(cards.length - 1) * window.innerHeight * 0.8}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    });
  };

  /* ---------- 07 · Transformation Slider (Before & After Showcase) ---------- */
  let tfCleanup = null;

  const initTransformationSlider = () => {
    if (tfCleanup) {
      tfCleanup();
      tfCleanup = null;
    }
    const section = $(".transformation");
    if (!section) return;

    const box = $(".tf-canvas-box", section);
    const handle = $(".tf-handle", section);
    const afterLayer = $(".tf-after", section);
    const coordEl = $(".tf-handle-coord", section);
    const beforeWatermark = $(".tf-watermark--before", section);
    const afterWatermark = $(".tf-watermark--after", section);

    if (!box || !handle || !afterLayer) return;

    let isDragging = false;
    let currentPercent = 50;

    const updateSlider = (percent) => {
      currentPercent = Math.max(0, Math.min(100, percent));
      handle.style.left = `${currentPercent}%`;
      handle.setAttribute("aria-valuenow", Math.round(currentPercent));
      afterLayer.style.clipPath = `inset(0 0 0 ${currentPercent}%)`;
      if (coordEl) {
        coordEl.textContent = `${Math.round(currentPercent)}%`;
      }

      const boxWidth = box.offsetWidth || 1;
      const handleX = (currentPercent / 100) * boxWidth;

      // Handle BEFORE watermark: dynamically clips/disappears when the percentage handle touches it
      if (beforeWatermark) {
        const beforeLeft = beforeWatermark.offsetLeft;
        const beforeWidth = beforeWatermark.offsetWidth;
        const beforeRight = beforeLeft + beforeWidth;

        if (handleX <= beforeLeft || currentPercent <= 0.5) {
          beforeWatermark.style.clipPath = `inset(0 ${beforeWidth}px 0 0)`;
          beforeWatermark.style.opacity = "0";
          beforeWatermark.style.visibility = "hidden";
        } else if (handleX < beforeRight) {
          const clipRight = Math.max(0, Math.min(beforeWidth, beforeRight - handleX));
          beforeWatermark.style.clipPath = `inset(0 ${clipRight}px 0 0)`;
          beforeWatermark.style.opacity = "1";
          beforeWatermark.style.visibility = "visible";
        } else {
          beforeWatermark.style.clipPath = "none";
          beforeWatermark.style.opacity = "1";
          beforeWatermark.style.visibility = "visible";
        }
      }

      // Handle AFTER watermark: dynamically disappears when the percentage handle touches it
      if (afterWatermark) {
        const afterLeft = afterWatermark.offsetLeft;
        const afterWidth = afterWatermark.offsetWidth;
        const afterRight = afterLeft + afterWidth;

        if (handleX >= afterRight || currentPercent >= 99.5) {
          afterWatermark.style.opacity = "0";
          afterWatermark.style.visibility = "hidden";
        } else {
          afterWatermark.style.opacity = "1";
          afterWatermark.style.visibility = "visible";
        }
      }
    };

    const getPointerPercent = (e) => {
      const rect = box.getBoundingClientRect();
      const clientX =
        e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    };

    const onPointerDown = (e) => {
      isDragging = true;
      box.classList.add("is-dragging");
      updateSlider(getPointerPercent(e));
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updateSlider(getPointerPercent(e));
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      box.classList.remove("is-dragging");
    };

    // Direct conversion link from Before & After to Quote Engine
    const quoteBtn = $("#tfQuoteBtn", section);
    const onQuoteBtnClick = (e) => {
      e.preventDefault();
      const matchingChip = document.querySelector(
        '.q-chip[data-value="Fleet Wraps & Vans"]',
      );
      if (matchingChip) matchingChip.click();
      const calcSection = document.getElementById("calculator");
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: "smooth" });
      }
    };
    if (quoteBtn) {
      quoteBtn.addEventListener("click", onQuoteBtnClick);
    }

    // Event listeners for dragging
    box.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    box.addEventListener("touchstart", onPointerDown, { passive: false });
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);

    // Keyboard support
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        updateSlider(currentPercent - 5);
      } else if (e.key === "ArrowRight") {
        updateSlider(currentPercent + 5);
      }
    };
    handle.addEventListener("keydown", onKeyDown);

    // Initial position
    updateSlider(50);

    tfCleanup = () => {
      box.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      box.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      handle.removeEventListener("keydown", onKeyDown);
      if (quoteBtn) {
        quoteBtn.removeEventListener("click", onQuoteBtnClick);
      }
      if (beforeWatermark) {
        beforeWatermark.style.clipPath = "";
        beforeWatermark.style.opacity = "";
        beforeWatermark.style.visibility = "";
      }
      if (afterWatermark) {
        afterWatermark.style.opacity = "";
        afterWatermark.style.visibility = "";
      }
    };
  };

  /* ---------- 10 · FAQ Accordion ---------- */
  const initFaqAccordion = () => {
    const section = $(".faq-section");
    if (!section) return;

    const items = $$(".faq-item", section);

    items.forEach((item) => {
      const trigger = $(".faq-trigger", item);
      const panel = $(".faq-panel", item);
      if (!trigger || !panel) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        // Close other items
        items.forEach((other) => {
          if (other !== item && other.classList.contains("is-open")) {
            other.classList.remove("is-open");
            const otherTrigger = $(".faq-trigger", other);
            const otherPanel = $(".faq-panel", other);
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        // Toggle clicked item
        if (isOpen) {
          item.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = null;
        } else {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  };

  /* ---------- 11 · Quote Configurator ---------- */
  const initQuoteConfigurator = () => {
    const form = $("#quote-form");
    if (!form) return;

    const chips = $$(".q-chip", form);
    const waBtn = $("#q-wa-btn");
    const submitBtn = $("#q-submit-btn");
    const feedback = $("#quote-feedback");
    const subtitleEl = $("#quote-dynamic-subtitle");
    const notesInput = $("#q-notes");

    let selectedDiscipline = "Fleet Wraps & Vans";
    let selectedScope = "Fleet (2 - 5 Vehicles)";

    const disciplineDescriptions = {
      "Fleet Wraps & Vans": "Turn your vehicle fleet into high-impact mobile billboards. Built with durable branded vinyls.",
      "Facade Advertising": "Transform your building facade into a 24/7 brand beacon with precision illuminated 3D lettering.",
      "Flags & Masts": "Elevate your site visibility with weather-tested architectural flags and ground-anchored masts.",
      "Tinting Car Windows": "Heat-rejecting, UV-blocking privacy films with flawless Dutch certification standards.",
      "Vehicle Lettering": "Clean, sharp typography and vector graphics tailored for commercial utility vehicles.",
      "Car Wraps": "Full or partial color-change wraps using premium cast vinyls for maximum durability.",
      "Window Films": "Etched glass, frosted privacy films and sun-control solutions for offices and shops.",
      "Visuals": "Large-format wall visual graphics, photographic prints and interior ambient branding.",
      "Signage": "Durable exterior and interior directional signs, totems, and branded entrance panels.",
      "Specials": "Custom architectural installations, metallic finishes, and bespoke wrapping projects.",
      "Construction Signs & Banners": "Heavy-duty mesh banners, site hoarding signage, and wind-resistant outdoor displays.",
      "Stickers": "High-precision die-cut vinyl stickers, decals, and safety compliance labels in any volume."
    };

    const updateWhatsAppUrl = () => {
      if (!waBtn) return;
      const text = encodeURIComponent(
        `Hallo Eipi, ik wil graag een offerte en 1:1 digitaal ontwerp ontvangen voor:\n• Discipline: ${selectedDiscipline}\n• Scope: ${selectedScope}`,
      );
      waBtn.href = `https://wa.me/31299667700?text=${text}`;
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const group = chip.getAttribute("data-group");
        const val = chip.getAttribute("data-value");

        // Deselect sibling chips in the same group
        $$(`.q-chip[data-group="${group}"]`, form).forEach((sibling) => {
          sibling.classList.remove("is-active");
        });

        chip.classList.add("is-active");

        if (group === "discipline") {
          selectedDiscipline = val;
          if (subtitleEl && disciplineDescriptions[val]) {
            subtitleEl.style.opacity = "0";
            setTimeout(() => {
              subtitleEl.textContent = disciplineDescriptions[val];
              subtitleEl.style.opacity = "1";
            }, 180);
          }
          if (notesInput && (!notesInput.value || notesInput.value === notesInput.placeholder)) {
            notesInput.placeholder = disciplineDescriptions[val] || "Turn your vehicle fleet into high-impact mobile billboards. Built with durable branded vinyls.";
          }
        }
        if (group === "scope") selectedScope = val;

        updateWhatsAppUrl();
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!submitBtn) return;

      submitBtn.disabled = true;
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>Sending Request...</span>";

      setTimeout(() => {
        submitBtn.innerHTML = "<span>Request Received ✓</span>";
        if (feedback) {
          feedback.style.display = "flex";
          if (window.gsap) {
            gsap.fromTo(
              feedback,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            );
          }
        }
      }, 700);
    });

    updateWhatsAppUrl();
  };

  /* ---------- 09 · Physics footer (blunt Matter.js port) ---------- */
  let physFooterCleanup = null;
  let physFooterTrigger = null;

  const initPhysicsFooter = () => {
    const footer = $("footer.site-footer");
    const container = $(".footer-objects", footer);
    if (!footer || !container || !window.Matter) return;

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    const CONFIG = {
      gravity: { x: 0, y: 1 },
      restitution: 0.5,
      friction: 0.15,
      frictionAir: 0.02,
      density: 0.002,
      wallThickness: 200,
    };

    let engine = null;
    let runner = null;
    let topWallTimeout = null;
    let rafId = 0;
    const bodies = [];
    const cleanupFns = [];

    const initPhysics = () => {
      if (engine) return;

      engine = Matter.Engine.create();
      engine.gravity.x = CONFIG.gravity.x;
      engine.gravity.y = CONFIG.gravity.y;

      const containerRect = container.getBoundingClientRect();
      const wallThickness = CONFIG.wallThickness;

      const walls = [
        Matter.Bodies.rectangle(
          containerRect.width / 2,
          containerRect.height + wallThickness / 2,
          containerRect.width + wallThickness * 2,
          wallThickness,
          { isStatic: true },
        ),
        Matter.Bodies.rectangle(
          -wallThickness / 2,
          containerRect.height / 2,
          wallThickness,
          containerRect.height + wallThickness * 2,
          { isStatic: true },
        ),
        Matter.Bodies.rectangle(
          containerRect.width + wallThickness / 2,
          containerRect.height / 2,
          wallThickness,
          containerRect.height + wallThickness * 2,
          { isStatic: true },
        ),
      ];
      Matter.World.add(engine.world, walls);

      const objects = $$(".footer-object", container);
      objects.forEach((obj, index) => {
        const objRect = obj.getBoundingClientRect();
        const startX =
          Math.random() * (containerRect.width - objRect.width) +
          objRect.width / 2;
        const startY = -500 - index * 100;
        const startRotation = (Math.random() - 0.5) * Math.PI;

        const body = Matter.Bodies.rectangle(
          startX,
          startY,
          objRect.width,
          objRect.height,
          {
            restitution: CONFIG.restitution,
            friction: CONFIG.friction,
            frictionAir: CONFIG.frictionAir,
            density: CONFIG.density,
          },
        );

        Matter.Body.setAngle(body, startRotation);

        bodies.push({
          body,
          element: obj,
          width: objRect.width,
          height: objRect.height,
        });

        Matter.World.add(engine.world, body);
      });

      topWallTimeout = setTimeout(() => {
        if (!engine) return;
        const topWall = Matter.Bodies.rectangle(
          containerRect.width / 2,
          -wallThickness / 2,
          containerRect.width + wallThickness * 2,
          wallThickness,
          { isStatic: true },
        );
        Matter.World.add(engine.world, topWall);
      }, 3000);

      const getBounds = (width, height) => ({
        minX: width / 2,
        maxX: containerRect.width - width / 2,
        maxY: containerRect.height - height / 2,
      });

      const pointer = { x: 0, y: 0, lastX: 0, lastY: 0 };
      const INTERACT_RADIUS = 140;

      const scatterFromPointer = (clientX, clientY) => {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const moveX = x - pointer.lastX;
        const moveY = y - pointer.lastY;

        pointer.x = x;
        pointer.y = y;
        pointer.lastX = x;
        pointer.lastY = y;

        if (Math.hypot(moveX, moveY) < 0.5) return;

        bodies.forEach(({ body }) => {
          const dx = body.position.x - x;
          const dy = body.position.y - y;
          const dist = Math.hypot(dx, dy) || 1;

          if (dist > INTERACT_RADIUS) return;

          const falloff = 1 - dist / INTERACT_RADIUS;
          const push = falloff * 0.9;

          Matter.Body.setVelocity(body, {
            x: clamp(
              body.velocity.x + (dx / dist) * push * 18 + moveX * 0.45,
              -20,
              20,
            ),
            y: clamp(
              body.velocity.y + (dy / dist) * push * 18 + moveY * 0.45,
              -20,
              20,
            ),
          });

          Matter.Body.setAngularVelocity(
            body,
            clamp(
              body.angularVelocity + moveX * 0.008 * falloff,
              -0.35,
              0.35,
            ),
          );
        });
      };

      // Pills are not interactive on mobile.
      if (window.innerWidth >= 1000) {
        const onMouseMove = (e) => scatterFromPointer(e.clientX, e.clientY);
        const onTouchMove = (e) => {
          const touch = e.touches[0];
          if (!touch) return;
          scatterFromPointer(touch.clientX, touch.clientY);
        };
        const onPointerEnter = (e) => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          pointer.x = pointer.lastX = x;
          pointer.y = pointer.lastY = y;
        };

        footer.addEventListener("mousemove", onMouseMove);
        footer.addEventListener("mouseenter", onPointerEnter);
        footer.addEventListener("touchmove", onTouchMove, { passive: true });

        cleanupFns.push(() => {
          footer.removeEventListener("mousemove", onMouseMove);
          footer.removeEventListener("mouseenter", onPointerEnter);
          footer.removeEventListener("touchmove", onTouchMove);
        });
      }

      Matter.Events.on(engine, "afterUpdate", () => {
        bodies.forEach(({ body, width, height }) => {
          const { minX, maxX, maxY } = getBounds(width, height);
          let { x, y } = body.position;
          let vx = body.velocity.x;
          let vy = body.velocity.y;
          let corrected = false;

          if (x < minX) {
            x = minX;
            vx = Math.abs(vx) * CONFIG.restitution;
            corrected = true;
          } else if (x > maxX) {
            x = maxX;
            vx = -Math.abs(vx) * CONFIG.restitution;
            corrected = true;
          }

          if (y > maxY) {
            y = maxY;
            vy = -Math.abs(vy) * CONFIG.restitution;
            corrected = true;
          }

          if (!corrected) return;

          Matter.Body.setPosition(body, { x, y });
          Matter.Body.setVelocity(body, { x: vx, y: vy });
        });
      });

      runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);

      const updatePositions = () => {
        bodies.forEach(({ body, element, width, height }) => {
          const x = clamp(
            body.position.x - width / 2,
            0,
            containerRect.width - width,
          );
          const y = clamp(
            body.position.y - height / 2,
            -height * 3,
            containerRect.height - height,
          );

          element.style.left = `${x}px`;
          element.style.top = `${y}px`;
          element.style.transform = `rotate(${body.angle}rad)`;
        });

        rafId = requestAnimationFrame(updatePositions);
      };

      updatePositions();
    };

    physFooterTrigger = ScrollTrigger.create({
      trigger: footer,
      start: "top bottom",
      once: true,
      onEnter: initPhysics,
    });

    physFooterCleanup = () => {
      if (physFooterTrigger) {
        physFooterTrigger.kill();
        physFooterTrigger = null;
      }
      clearTimeout(topWallTimeout);
      cancelAnimationFrame(rafId);
      cleanupFns.forEach((fn) => fn());
      if (runner) Matter.Runner.stop(runner);
      if (engine) {
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
      }
    };
  };

  /* ---------- Resize re-init (mirrors otis pattern) ---------- */
  let resizeHandler = null;
  const bindResize = () => {
    if (resizeHandler) return;
    let resizeTimeout;
    resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener("resize", resizeHandler);
  };
  const unbindResize = () => {
    if (!resizeHandler) return;
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  };

  /* ---------- Static state (mobile / reduced motion) ---------- */
  const setStaticState = () => {
    if (physFooterCleanup) {
      physFooterCleanup();
      physFooterCleanup = null;
    }
    if (methodStackTrigger) {
      methodStackTrigger.kill();
      methodStackTrigger = null;
    }
    $$(".method-stack-card").forEach((card) =>
      gsap.set(card, { clearProps: "all" }),
    );
    if (spotlightTrigger) {
      spotlightTrigger.kill();
      spotlightTrigger = null;
    }
    const spotSection = $(".spotlight");
    if (spotSection) {
      spotSection.classList.remove("is-spot");
      $$(".spot-image", spotSection).forEach((img) =>
        gsap.set(img, { clearProps: "transform" }),
      );
    }
    if (statsCardsTween) {
      statsCardsTween.kill();
      statsCardsTween = null;
    }
    $$(".sc-card").forEach((card) =>
      gsap.set(card, { clearProps: "transform" }),
    );
    if (testiCleanup) {
      testiCleanup();
      testiCleanup = null;
    }
    unbindResize();
    $$("[data-o-reveal]").forEach((el) =>
      gsap.set(el, { clearProps: "transform" }),
    );
    $$("[data-o-scale]").forEach((el) =>
      gsap.set(el, { clearProps: "transform" }),
    );
    $$(".work-card").forEach((el) =>
      gsap.set(el, { clearProps: "transform, opacity" }),
    );
  };

  /* ---------- Boot ---------- */
  const boot = () => {
    // Promote the window to the scroll container. main.js sets
    // body { overflow: auto } while style.css keeps body { height: 100% },
    // which would make the BODY the scroller and break window-scroll
    // tools (ScrollTrigger, Lenis). Visible + auto height lets content
    // grow the document normally.
    document.documentElement.style.height = "auto";
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.height = "auto";
    document.body.style.overflow = "visible";

    if (typeof gsap === "undefined" || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // measure the header once so the hero can lock to exactly one screen
    const headerEl = $(".header");
    if (headerEl) {
      document.documentElement.style.setProperty(
        "--header-h",
        headerEl.offsetHeight + "px",
      );
    }

    initLenis();
    initStickyHeader();
    initAnchors();
    initNavDropdown();
    initTransformationSlider();
    initWhatWeMakeSlider();
    initFaqAccordion();
    initQuoteConfigurator();
    initWorkFilter();

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 1001px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { desktop, motion } = ctx.conditions;
        if (!desktop || !motion) {
          setStaticState();
          return;
        }
        initReveals();
        initSpotlight();
        initStatsCards();
        initMethodStack();
        initTestimonials();
        // initPhysicsFooter(); - retired for new editorial grid footer
        bindResize();
      },
    );

    ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());
  };

  /* Wait for the hero reveal to finish before measuring anything. */
  const waitForReveal = () => {
    const wrapper = $(".page-wrapper");
    if (!wrapper) {
      boot();
      return;
    }
    if (wrapper.classList.contains("is-revealed")) {
      requestAnimationFrame(boot);
      return;
    }
    const mo = new MutationObserver(() => {
      if (wrapper.classList.contains("is-revealed")) {
        mo.disconnect();
        requestAnimationFrame(() => requestAnimationFrame(boot));
      }
    });
    mo.observe(wrapper, { attributes: true, attributeFilter: ["class"] });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForReveal);
  } else {
    waitForReveal();
  }
})();
