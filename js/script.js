/* ════════════════════════════════════════════════════════
   SATYAM PATEL — PORTFOLIO ENGINE
   cursor physics · neural canvas · GSAP choreography
   ════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const docEl = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = typeof gsap !== "undefined";

  if (!hasGSAP || reduceMotion) {
    docEl.classList.add("no-js"); // CSS fallback: everything visible, no scroll reveals
  }
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ════════════════════════════════════════════
     1 · PRELOADER
     ════════════════════════════════════════════ */
  const preloader = document.getElementById("preloader");
  const preBar = document.getElementById("preloaderBar");
  const preCount = document.getElementById("preloaderCount");
  let heroStarted = false;

  function finishPreloader() {
    preloader.classList.add("is-done");
    setTimeout(startHero, 420);
  }

  if (reduceMotion) {
    preloader.style.display = "none";
    startHero();
  } else {
    let progress = 0;
    const tick = () => {
      progress += Math.random() * 16 + 6;
      if (progress >= 100) {
        progress = 100;
        preBar.style.width = "100%";
        preCount.textContent = "100%";
        setTimeout(finishPreloader, 260);
        return;
      }
      preBar.style.width = progress + "%";
      preCount.textContent = Math.floor(progress) + "%";
      setTimeout(tick, Math.random() * 130 + 60);
    };
    tick();
    // safety: never trap the user behind the loader
    setTimeout(() => { if (!heroStarted) finishPreloader(); }, 3500);
  }

  /* ════════════════════════════════════════════
     2 · HERO ENTRANCE
     ════════════════════════════════════════════ */
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    if (!hasGSAP || reduceMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__title-word", { yPercent: 110, rotate: 4, duration: 1.15, stagger: 0.14 })
      .to(".reveal-line", { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
      .from(".hero__sub", { opacity: 0, y: 24, duration: 0.7 }, "-=0.55")
      .from(".hero__desc", { opacity: 0, y: 24, duration: 0.7 }, "-=0.5")
      .from(".hero__actions .btn", { opacity: 0, y: 26, stagger: 0.1, duration: 0.65 }, "-=0.45")
      .from(".hero__socials .hero__social", { opacity: 0, y: 18, scale: 0.6, stagger: 0.07, duration: 0.5, ease: "back.out(2)" }, "-=0.4")
      .from(".hero__scroll-hint", { opacity: 0, duration: 0.8 }, "-=0.3")
      .from(".hero__badge", { opacity: 0, scale: 0.5, duration: 0.7, ease: "back.out(1.8)" }, "-=0.6")
      .from(".hero__big-bg", { opacity: 0, x: 80, duration: 1.4, ease: "power3.out" }, "-=1.0");
  }

  /* ════════════════════════════════════════════
     3 · TYPEWRITER
     ════════════════════════════════════════════ */
  const roles = [
    "RAG architectures.",
    "RL agents.",
    "vision pipelines.",
    "multi-agent systems.",
    "production MLOps.",
    "healthcare AI automation.",
    "agentic workflows."
  ];
  const typeEl = document.getElementById("typewriter");
  if (typeEl) {
    let ri = 0, ci = 0, deleting = false;
    const typeLoop = () => {
      const word = roles[ri];
      typeEl.textContent = word.slice(0, ci);
      let delay;
      if (!deleting) {
        ci++;
        delay = 65 + Math.random() * 55;
        if (ci > word.length) { deleting = true; delay = 1700; }
      } else {
        ci--;
        delay = 32;
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
      }
      setTimeout(typeLoop, delay);
    };
    setTimeout(typeLoop, reduceMotion ? 0 : 1600);
  }

  /* ════════════════════════════════════════════
     4 · CUSTOM CURSOR (spring-lagged ring)
     ════════════════════════════════════════════ */
  if (finePointer && !reduceMotion) {
    docEl.classList.add("has-cursor");
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    const label = document.getElementById("cursorLabel");

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    (function ringLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(ringLoop);
    })();

    // hover states via delegation
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      ring.classList.remove("is-hover", "is-view");
      if (!t) { label.textContent = ""; return; }
      const mode = t.getAttribute("data-cursor");
      if (mode === "view") { ring.classList.add("is-view"); label.textContent = "View"; }
      else { ring.classList.add("is-hover"); label.textContent = ""; }
    });
    addEventListener("mousedown", () => ring.classList.add("is-down"));
    addEventListener("mouseup", () => ring.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => { dot.style.opacity = 0; ring.style.opacity = 0; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = 1; ring.style.opacity = 1; });
  } else {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  /* ════════════════════════════════════════════
     5 · NEURAL NETWORK CANVAS
     ════════════════════════════════════════════ */
  const canvas = document.getElementById("neuralCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];
    const mouse = { x: -9999, y: -9999 };
    const LINK_DIST = 130;
    const MOUSE_DIST = 170;

    function resize() {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
      const count = Math.min(110, Math.floor((W * H) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() < 0.5 ? 245 : (Math.random() < 0.5 ? 280 : 190)
      }));
    }
    resize();
    addEventListener("resize", resize, { passive: true });
    addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    addEventListener("touchmove", (e) => {
      if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
    }, { passive: true });

    let running = true;
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) frame();
    });

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // gentle mouse attraction-then-swirl
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / MOUSE_DIST) * 0.035;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
        p.vx *= 0.985; p.vy *= 0.985;             // damping
        const sp = Math.hypot(p.vx, p.vy);        // speed cap
        if (sp > 1.4) { p.vx = (p.vx / sp) * 1.4; p.vy = (p.vy / sp) * 1.4; }
        if (sp < 0.12) { p.vx += (Math.random() - 0.5) * 0.06; p.vy += (Math.random() - 0.5) * 0.06; }

        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.30;
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 85%, 68%, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // node
        ctx.fillStyle = `hsla(${a.hue}, 90%, 72%, 0.85)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ════════════════════════════════════════════
     6 · NAV  (scrolled state · progress · burger)
     ════════════════════════════════════════════ */
  const nav = document.getElementById("nav");
  const progressFill = document.getElementById("scrollProgress");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", scrollY > 40);

    // hide on scroll down, return on scroll up
    const delta = scrollY - lastY;
    if (Math.abs(delta) > 6) {
      if (delta > 0 && scrollY > 320 && !navLinks.classList.contains("is-open")) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      lastY = scrollY;
    }

    const max = docEl.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    progressFill.style.width = (p * 100) + "%";

    // back-to-top ring
    if (topBtn) {
      topBtn.classList.toggle("is-show", scrollY > 600);
      if (topFill) topFill.style.strokeDashoffset = (125.7 * (1 - p)).toFixed(1);
    }
  }, { passive: true });

  const topBtn = document.getElementById("topBtn");
  const topFill = document.getElementById("topBtnFill");
  if (topBtn) {
    topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-open");
    navLinks.classList.toggle("is-open");
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      burger.classList.remove("is-open");
      navLinks.classList.remove("is-open");
    }
  });

  /* ════════════════════════════════════════════
     7 · SPOTLIGHT  (mouse-tracked radial on cards)
     ════════════════════════════════════════════ */
  if (finePointer) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ════════════════════════════════════════════
     8 · 3D TILT
     ════════════════════════════════════════════ */
  if (finePointer && !reduceMotion) {
    const MAX_TILT = 7;
    document.querySelectorAll(".tilt-card").forEach((card) => {
      let raf = null;
      card.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            `perspective(900px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg) translateZ(0)`;
          raf = null;
        });
      });
      card.addEventListener("pointerleave", () => {
        card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        setTimeout(() => (card.style.transition = ""), 600);
      });
    });
  }

  /* ════════════════════════════════════════════
     9 · MAGNETIC ELEMENTS
     ════════════════════════════════════════════ */
  if (finePointer && !reduceMotion && hasGSAP) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ════════════════════════════════════════════
     10 · SCROLL CHOREOGRAPHY (GSAP)
     ════════════════════════════════════════════ */
  if (hasGSAP && !reduceMotion) {

    // section titles — split into chars, cascade up
    document.querySelectorAll("[data-split]").forEach((title) => {
      const text = title.textContent;
      title.setAttribute("aria-label", text);
      title.textContent = "";
      [...text].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? " " : ch;
        span.setAttribute("aria-hidden", "true");
        title.appendChild(span);
      });
      gsap.from(title.querySelectorAll(".char"), {
        scrollTrigger: {
          trigger: title,
          start: "top 88%",
          onEnter: () => title.classList.add("is-inview")
        },
        yPercent: 120,
        opacity: 0,
        rotate: 6,
        duration: 0.9,
        stagger: 0.028,
        ease: "power4.out"
      });
    });

    // generic reveals
    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", overwrite: true })
    });

    // featured projects
    ScrollTrigger.batch(".project", {
      start: "top 86%",
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: "power4.out", overwrite: true })
    });

    // mini projects
    ScrollTrigger.batch(".mini-project", {
      start: "top 90%",
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true })
    });

    // metrics counters
    document.querySelectorAll(".counter").forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const obj = { v: 0 };
      gsap.to(obj, {
        scrollTrigger: { trigger: el, start: "top 90%" },
        v: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => { el.textContent = Math.floor(obj.v) + suffix; }
      });
    });

    // timeline line fill — scrubbed
    const tlFill = document.getElementById("timelineFill");
    if (tlFill) {
      gsap.to(tlFill, {
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.6
        },
        height: "100%",
        ease: "none"
      });
    }

    // hero parallax on scroll-out — drift UP and fade so it never
    // slides down over the metrics section below
    gsap.to(".hero__inner", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 },
      yPercent: -12,
      opacity: 0.1,
      ease: "none"
    });
    gsap.to(".hero__big-bg", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 },
      yPercent: -30,
      ease: "none"
    });

    // contact title dramatic entrance handled by [data-split]; add mail pop
    gsap.from(".contact__mail", {
      scrollTrigger: { trigger: ".contact", start: "top 70%" },
      scale: 0.7,
      opacity: 0,
      duration: 0.9,
      ease: "back.out(1.8)"
    });

    // statement — words light up as you scroll through them
    const stmt = document.getElementById("statementText");
    if (stmt) {
      const frag = document.createDocumentFragment();
      [...stmt.childNodes].forEach((node) => {
        const cls = node.nodeType === 1 ? "word word--accent" : "word";
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
          const s = document.createElement("span");
          s.className = cls;
          s.textContent = tok;
          frag.appendChild(s);
        });
      });
      stmt.textContent = "";
      stmt.appendChild(frag);
      gsap.to(stmt.querySelectorAll(".word"), {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: { trigger: stmt, start: "top 80%", end: "center 42%", scrub: 0.4 }
      });
    }
  } else {
    // ensure visibility without GSAP
    document.querySelectorAll(".reveal, .reveal-line, .project, .mini-project").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }

  /* ════════════════════════════════════════════
     11 · SCROLL-SPY (active nav link)
     ════════════════════════════════════════════ */
  if ("IntersectionObserver" in window) {
    const spyLinks = [...document.querySelectorAll(".nav__link")];
    const byId = {};
    spyLinks.forEach((l) => { byId[l.getAttribute("href").slice(1)] = l; });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        spyLinks.forEach((l) => l.classList.remove("is-active"));
        const link = byId[en.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    Object.keys(byId).forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ════════════════════════════════════════════
     12 · COPY EMAIL + TOAST
     ════════════════════════════════════════════ */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2300);
  }
  const copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = "Satyampatel779@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied to clipboard ✓");
      } catch {
        showToast(email);
      }
    });
  }

  /* ════════════════════════════════════════════
     13 · AURORA MOUSE PARALLAX
     ════════════════════════════════════════════ */
  if (finePointer && !reduceMotion) {
    const aurora = document.querySelector(".aurora");
    let ax = 0, ay = 0, tx = 0, ty = 0;
    addEventListener("mousemove", (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 38;
      ty = (e.clientY / innerHeight - 0.5) * 30;
    }, { passive: true });
    (function auroraLoop() {
      ax += (tx - ax) * 0.04;
      ay += (ty - ay) * 0.04;
      aurora.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
      requestAnimationFrame(auroraLoop);
    })();
  }

  /* ════════════════════════════════════════════
     14 · ABOUT TERMINAL — typed on first view
     ════════════════════════════════════════════ */
  const termBody = document.getElementById("terminalBody");
  if (termBody && hasGSAP && !reduceMotion) {
    const lines = [...termBody.querySelectorAll(".t-line")];
    lines.forEach((l) => { l.style.display = "none"; });
    let termStarted = false;

    function runTerminal() {
      if (termStarted) return;
      termStarted = true;
      let i = 0;
      const next = () => {
        if (i >= lines.length) return;
        const line = lines[i++];
        const cmd = line.querySelector(".t-cmd");
        line.style.display = "";
        if (cmd) {
          const full = cmd.textContent;
          cmd.textContent = "";
          let ci = 0;
          const typeChar = () => {
            cmd.textContent = full.slice(0, ++ci);
            if (ci < full.length) setTimeout(typeChar, 36 + Math.random() * 52);
            else setTimeout(next, 300);
          };
          typeChar();
        } else {
          setTimeout(next, 190);
        }
      };
      next();
    }

    ScrollTrigger.create({
      trigger: termBody,
      start: "top 82%",
      once: true,
      onEnter: runTerminal
    });
  }

  /* ════════════════════════════════════════════
     15 · LOGO SCRAMBLE ON HOVER
     ════════════════════════════════════════════ */
  const logoText = document.querySelector(".nav__logo-text");
  if (logoText && logoText.firstChild && finePointer && !reduceMotion) {
    const original = logoText.firstChild.nodeValue;
    const glyphs = "!<>-_/[]{}=+*^?#$%&";
    let scrambleTimer = null;
    document.querySelector(".nav__logo").addEventListener("mouseenter", () => {
      if (scrambleTimer) return;
      let frame = 0;
      scrambleTimer = setInterval(() => {
        frame++;
        const settled = Math.floor(frame / 2);
        let out = "";
        for (let i = 0; i < original.length; i++) {
          out += i < settled ? original[i] : glyphs[(Math.random() * glyphs.length) | 0];
        }
        logoText.firstChild.nodeValue = out;
        if (settled >= original.length) {
          clearInterval(scrambleTimer);
          scrambleTimer = null;
          logoText.firstChild.nodeValue = original;
        }
      }, 40);
    });
  }

  /* ════════════════════════════════════════════
     16 · CONSOLE EASTER EGG
     ════════════════════════════════════════════ */
  try {
    console.log(
      "%cSATYAM PATEL%c\n\nHey, fellow dev 👋 — since you're poking around:\nthis site is hand-built vanilla JS + GSAP, no framework.\n\n→ github.com/Satyampatel779\n→ Satyampatel779@gmail.com\n",
      "font-size:20px;font-weight:900;padding:8px 18px;border-radius:8px;background:linear-gradient(100deg,#6366f1,#a855f7,#22d3ee);color:#fff",
      "color:#9a9cad;font-size:12px;line-height:1.7"
    );
  } catch {}
})();
