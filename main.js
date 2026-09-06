document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }

  const updateHeaderHeight = () => {
    const headerEl = document.querySelector(".header");
    if (headerEl) {
      document.documentElement.style.setProperty(
        "--header-h",
        headerEl.offsetHeight + "px",
      );
    }
  };
  updateHeaderHeight();
  window.addEventListener("resize", updateHeaderHeight);

  // 1. Play video safely & track flush progress bar
  const video = document.querySelector(".reel-video");
  const progressFill = document.querySelector(".reel-progress-fill");

  if (video) {
    video.muted = true;
    video.play().catch(() => {
      video.controls = false;
    });

    video.addEventListener("timeupdate", () => {
      const cur = video.currentTime;
      const dur = video.duration;

      if (!isNaN(dur) && dur > 0 && progressFill) {
        const pct = (cur / dur) * 100;
        progressFill.style.width = `${pct}%`;
      }
    });
  }

  // 2. CustomEase "hop" curve
  gsap.registerPlugin(CustomEase);
  CustomEase.create(
    "hop",
    "M0,0 C0.29,0 0.348,0.05 0.422,0.134 0.494,0.217 0.484,0.355 0.5,0.5 0.518,0.662 0.515,0.793 0.596,0.876 0.701,0.983 0.72,0.987 1,1 ",
  );

  // 3. Balanced, Fluid Page Reveal Timeline
  const revealLandingPage = () => {
    // Unclip page wrapper upwards (timed smoothly at 1.65s)
    gsap.to(".page-wrapper", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      duration: 1.65,
      ease: "hop",
      onStart: () => {
        // Expand wrapper scale to 100%
        gsap.to(".page-wrapper", {
          transform: "translate(-50%, -50%) scale(1)",
          duration: 1.85,
          ease: "power3.inOut",
          delay: 0.2,
        });

        // Wipe red overlay box away toward top
        gsap.to(".overlay", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.6,
          delay: 0.38,
          ease: "hop",
          onComplete: () => {
            gsap.set(".overlay, .loader", { display: "none" });

            const wrapper = document.querySelector(".page-wrapper");
            wrapper.classList.add("is-revealed");
            updateHeaderHeight();

            // Clear inline styles so micro-interactions work cleanly
            gsap.set([wrapper, ".reel-video", ".reveal-elem"], {
              clearProps: "all",
            });

            window.scrollTo(0, 0);
          },
        });

        // Video Reel settles into frame
        gsap.to(".reel-video", {
          transform: "scale(1)",
          duration: 1.6,
          ease: "power2.out",
          delay: 0.45,
        });

        // Fade in progress bar at bottom of reel
        gsap.to(".reel-progress-track", {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.8,
        });

        // --- Content Reveals ---
        // 1. Big Headline
        gsap.to(".hero-heading .hero-line", {
          y: 0,
          stagger: 0.08,
          duration: 1.35,
          ease: "power3.out",
          delay: 0.88,
        });

        // 2. Google Rating
        gsap.to(".google-rating", {
          y: 0,
          duration: 1.25,
          ease: "power3.out",
          delay: 0.95,
        });

        // 3. Banner Paragraph Text
        gsap.to(".banner-paragraph", {
          y: 0,
          duration: 1.3,
          ease: "power3.out",
          delay: 1.0,
        });

        // 4. Action Buttons
        gsap.to([".btn-calculate", ".btn-recent-works"], {
          y: 0,
          stagger: 0.07,
          duration: 1.25,
          ease: "power3.out",
          delay: 1.05,
        });

        // 5. Checklist Items
        gsap.to(".badge-item", {
          y: 0,
          stagger: 0.05,
          duration: 1.25,
          ease: "power3.out",
          delay: 1.05,
        });

        // 6. Header Navigation, Logo, and CTA
        gsap.to([".logo-link", ".nav-item", ".header-phone-btn"], {
          y: 0,
          stagger: 0.03,
          duration: 1.2,
          ease: "power3.out",
          delay: 1.1,
        });
      },
    });
  };

  // 4. Initial Logo Slide-up Entrance -> Balanced Hold -> Trigger Reveal
  gsap.to(".loader-logo img", {
    y: 0,
    duration: 0.75,
    ease: "power3.out",
    delay: 0.15,
    onComplete: () => {
      setTimeout(() => {
        revealLandingPage();
      }, 280);
    },
  });
});
