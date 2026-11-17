
/* ═══════════════════════════════════════════════
   ANURAG KUMAR PORTFOLIO — script.js
   ═══════════════════════════════════════════════ */

/* 1. PARTICLE BACKGROUND */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let W, H;
  let particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.x = initial ? Math.random() * W : (Math.random() > 0.5 ? 0 : W);
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.4 + 0.05;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (
        this.x < -5 ||
        this.x > W + 5 ||
        this.y < -5 ||
        this.y > H + 5
      ) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();

    const count = Math.min(130, Math.floor((W * H) / 11000));

    particles = Array.from(
      { length: Math.max(45, count) },
      () => new Particle()
    );
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.update();
      p.draw();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);

        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle =
            `rgba(124,58,237,${0.07 * (1 - d / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize, { passive: true });

  init();
  loop();
})();


/* 2. THREE.JS FLOATING OCTAHEDRON */
(function () {
  const canvas = document.getElementById("cube-canvas");

  if (!canvas || typeof THREE === "undefined") return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(120, 120, false);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 3;

  const outerGeo = new THREE.OctahedronGeometry(1, 0);
  const edgesGeo = new THREE.EdgesGeometry(outerGeo);

  const wireMat = new THREE.LineBasicMaterial({
    color: 0x7c3aed
  });

  const wireframe = new THREE.LineSegments(edgesGeo, wireMat);
  scene.add(wireframe);

  const innerGeo = new THREE.OctahedronGeometry(0.72, 0);

  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x4f46e5,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide
  });

  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  const dotGeo = new THREE.BufferGeometry();
  const dotCount = 40;
  const dotPos = new Float32Array(dotCount * 3);

  for (let i = 0; i < dotCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.3 + Math.random() * 0.4;

    dotPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dotPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dotPos[i * 3 + 2] = r * Math.cos(phi);
  }

  dotGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(dotPos, 3)
  );

  const dotMat = new THREE.PointsMaterial({
    color: 0xa78bfa,
    size: 0.05
  });

  const dotMesh = new THREE.Points(dotGeo, dotMat);
  scene.add(dotMesh);

  let t = 0;

  function animate() {
    requestAnimationFrame(animate);

    t += 0.012;

    wireframe.rotation.x = t * 0.6;
    wireframe.rotation.y = t;

    inner.rotation.x = -t * 0.4;
    inner.rotation.y = t * 0.7;

    dotMesh.rotation.y = t * 0.3;

    renderer.render(scene, camera);
  }

  animate();
})();


/* 3. TYPING ANIMATION */
(function () {
  const roles = [
    "Web Developer 🌐",
    "Java Developer ☕",
    "Creative Coder 💻",
    "Problem Solver 🧩",
    "CSE Student 🚀"
  ];

  let ri = 0;
  let ci = 0;
  let deleting = false;

  const el = document.getElementById("typed");
  if (!el) return;

  function tick() {
    const word = roles[ri];

    if (!deleting) {
      el.textContent = word.slice(0, ++ci);

      if (ci === word.length) {
        deleting = true;
        return setTimeout(tick, 1800);
      }

      setTimeout(tick, 75);
    } else {
      el.textContent = word.slice(0, --ci);

      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }

      setTimeout(tick, 40);
    }
  }

  setTimeout(tick, 400);
})();


/* 4. LEETCODE COUNTER */
(function () {
  const el = document.getElementById("lc-count");
  if (!el) return;

  const target = 201;
  let current = 0;
  let started = false;

  function countUp() {
    if (current < target) {
      current += 1;
      el.textContent = current;
      setTimeout(countUp, 12);
    } else {
      el.textContent = target;
    }
  }

  const card = document.querySelector(".leetcode-badge-card");

  if (!card || !("IntersectionObserver" in window)) {
    countUp();
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        countUp();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  obs.observe(card);
})();


/* 5. SCROLL REVEAL */
(function () {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("visible"));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => obs.observe(el));
})();


/* 6. ACTIVE NAVIGATION ON SCROLL */
(function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function onScroll() {
    let current = "";

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 220) {
        current = section.id;
      }
    });

    navLinks.forEach((a) => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === "#" + current
      );
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();


/* 7. MOBILE HAMBURGER MENU */
(function () {
  const btn = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  if (!btn || !sidebar) return;

  btn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  sidebar.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });
})();


/* 8. MOUSE PARALLAX */
(function () {
  const bgCanvas = document.getElementById("bg-canvas");

  if (
    !bgCanvas ||
    !window.matchMedia("(pointer: fine)").matches
  ) return;

  document.addEventListener("mousemove", (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 8;
    const my = (e.clientY / window.innerHeight - 0.5) * 8;

    bgCanvas.style.transform =
      `translate(${mx}px, ${my}px)`;
  }, { passive: true });
})();


/* 9. SKILL TAG HOVER EFFECT */
(function () {
  document.querySelectorAll(".skill-tag").forEach((tag) => {
    tag.addEventListener("mouseenter", () => {
      tag.style.transform = "scale(1.07)";
    });

    tag.addEventListener("mouseleave", () => {
      tag.style.transform = "";
    });
  });
})();
