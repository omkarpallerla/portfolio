/* ============================================================
   OMKAR PALLERLA — PORTFOLIO
   Interactions & Animations
   ============================================================ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. Cursor glow
     ============================================================ */
  const glow = document.getElementById('cursorGlow');
  if (glow && !prefersReduced) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = '0.7';
    });
    const animateGlow = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }

  /* ============================================================
     2. Scroll progress + nav state
     ============================================================ */
  const progress = document.getElementById('scrollProgress');
  const nav = document.querySelector('.nav');
  const updateScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (progress) progress.style.width = scrolled + '%';
    if (nav) nav.classList.toggle('scrolled', h.scrollTop > 30);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  /* ============================================================
     3. Scroll reveal
     ============================================================ */
  const revealEls = document.querySelectorAll('.section, .project, .cert, .stack-col, .timeline li');
  revealEls.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ============================================================
     4. Animated stat counters
     ============================================================ */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ============================================================
     5. Project filter
     ============================================================ */
  const filterBar = document.getElementById('filterBar');
  if (filterBar) {
    const filters = filterBar.querySelectorAll('.filter');
    const projects = document.querySelectorAll('.project');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        projects.forEach(p => {
          const cats = (p.dataset.cat || '').split(' ');
          const show = f === 'all' || cats.includes(f);
          p.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* ============================================================
     6. 3D tilt on cards
     ============================================================ */
  if (!prefersReduced) {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    tiltEls.forEach(el => {
      let rect;
      el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (y - 0.5) * -8;
        const ry = (x - 0.5) * 10;
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ============================================================
     7. HERO CANVAS — 3D data-flow field
     A grid of points that wave, colored with gradient.
     Low-cost, GPU-smooth, BI-themed.
     ============================================================ */
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas && !prefersReduced) {
    const ctx = heroCanvas.getContext('2d');
    let w, h, dpr, points = [], mouseX = 0, mouseY = 0, time = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = heroCanvas.clientWidth;
      h = heroCanvas.clientHeight;
      heroCanvas.width = w * dpr;
      heroCanvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      buildPoints();
    };

    const buildPoints = () => {
      points = [];
      const cols = Math.ceil(w / 55) + 1;
      const rows = Math.ceil(h / 55) + 1;
      const sx = w / (cols - 1);
      const sy = h / (rows - 1);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          points.push({
            baseX: x * sx,
            baseY: y * sy,
            x: x * sx,
            y: y * sy,
            phase: (x + y) * 0.3,
          });
        }
      }
    };

    window.addEventListener('pointermove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, w, h);

      // Update positions with wave + mouse attraction
      points.forEach(p => {
        const wave = Math.sin(time * 2 + p.phase) * 6 + Math.cos(time * 1.4 + p.phase * 0.7) * 4;
        const dx = mouseX - p.baseX;
        const dy = mouseY - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 260);
        const pull = influence * 35;
        const angle = Math.atan2(dy, dx);
        p.x = p.baseX + Math.cos(angle) * pull + wave;
        p.y = p.baseY + Math.sin(angle) * pull + wave * 0.6;
        p._influence = influence;
      });

      // Lines — connect near neighbors
      ctx.lineWidth = 0.5;
      const cols = Math.ceil(w / 55) + 1;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const right = points[i + 1];
        const down = points[i + cols];
        // wrap check
        if (right && (i + 1) % cols !== 0) drawLine(a, right);
        if (down) drawLine(a, down);
      }

      // Points
      points.forEach(p => {
        const glowStrength = p._influence || 0;
        const size = 1.2 + glowStrength * 2.5;
        const alpha = 0.25 + glowStrength * 0.75;

        // gradient per point — shifts across canvas
        const hue = (p.baseX / w) * 60 + 190; // sky -> violet
        ctx.fillStyle = `hsla(${hue}, 90%, 70%, ${alpha})`;

        if (glowStrength > 0.1) {
          ctx.shadowColor = `hsla(${hue}, 90%, 70%, 0.8)`;
          ctx.shadowBlur = 10 * glowStrength;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      requestAnimationFrame(render);
    };

    const drawLine = (a, b) => {
      const infl = Math.max(a._influence || 0, b._influence || 0);
      const alpha = 0.05 + infl * 0.45;
      const hue = ((a.baseX + b.baseX) / 2 / w) * 60 + 190;
      ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    resize();
    window.addEventListener('resize', resize);
    render();
  }

  /* ============================================================
     8. CONSTELLATION — 3D rotating skill graph
     Nodes = tools, colored by category. Pseudo-3D via depth sort.
     ============================================================ */
  const constCanvas = document.getElementById('constCanvas');
  if (constCanvas && !prefersReduced) {
    const ctx = constCanvas.getContext('2d');
    let w, h, dpr;

    // categories
    const CAT = {
      bi: { color: '#7dd3fc' },
      de: { color: '#a78bfa' },
      wh: { color: '#f0abfc' },
      ml: { color: '#facc15' },
    };

    // Tool nodes — arranged in a 3D sphere-ish cloud
    const TOOLS = [
      // BI
      { label: 'Power BI', cat: 'bi', r: 12 },
      { label: 'Tableau', cat: 'bi', r: 11 },
      { label: 'Looker', cat: 'bi', r: 10 },
      { label: 'DAX', cat: 'bi', r: 8 },
      { label: 'LookML', cat: 'bi', r: 8 },
      { label: 'MicroStrategy', cat: 'bi', r: 9 },
      // DE
      { label: 'Databricks', cat: 'de', r: 12 },
      { label: 'Airflow', cat: 'de', r: 9 },
      { label: 'ADF', cat: 'de', r: 9 },
      { label: 'Dataflow', cat: 'de', r: 9 },
      { label: 'Pub/Sub', cat: 'de', r: 8 },
      { label: 'Delta Lake', cat: 'de', r: 9 },
      // Warehouses
      { label: 'Snowflake', cat: 'wh', r: 12 },
      { label: 'BigQuery', cat: 'wh', r: 12 },
      { label: 'SQL Server', cat: 'wh', r: 10 },
      { label: 'Postgres', cat: 'wh', r: 9 },
      // ML / Lang
      { label: 'Python', cat: 'ml', r: 11 },
      { label: 'SQL', cat: 'ml', r: 11 },
      { label: 'XGBoost', cat: 'ml', r: 9 },
      { label: 'Pandas', cat: 'ml', r: 9 },
      { label: 'Scikit', cat: 'ml', r: 8 },
    ];

    // Distribute on a sphere using fibonacci lattice
    const N = TOOLS.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    TOOLS.forEach((t, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      t.ox = Math.cos(theta) * radius;
      t.oy = y;
      t.oz = Math.sin(theta) * radius;
    });

    let rotY = 0, rotX = 0.2, targetRotY = 0, targetRotX = 0.2;
    let isHover = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = constCanvas.clientWidth;
      h = constCanvas.clientHeight;
      constCanvas.width = w * dpr;
      constCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    constCanvas.addEventListener('pointermove', (e) => {
      const rect = constCanvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 2;
      targetRotX = -ny * 1.2;
      isHover = true;
    });
    constCanvas.addEventListener('pointerleave', () => { isHover = false; });

    const project = (t, sphereR) => {
      // rotate
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      let x = t.ox * cosY - t.oz * sinY;
      let z = t.ox * sinY + t.oz * cosY;
      let y = t.oy * cosX - z * sinX;
      z = t.oy * sinX + z * cosX;

      // perspective
      const persp = 2.2 / (2.2 - z);
      const px = w / 2 + x * sphereR * persp;
      const py = h / 2 + y * sphereR * persp;
      return { x: px, y: py, z, scale: persp };
    };

    const animate = () => {
      if (!isHover) {
        // slow autospin
        targetRotY += 0.0015;
      }
      rotY += (targetRotY - rotY) * 0.06;
      rotX += (targetRotX - rotX) * 0.06;

      ctx.clearRect(0, 0, w, h);

      const sphereR = Math.min(w, h) * 0.35;

      // Project all
      const projected = TOOLS.map(t => ({ t, p: project(t, sphereR) }));
      projected.sort((a, b) => a.p.z - b.p.z);

      // Draw connections (same category)
      const byCat = {};
      projected.forEach(({ t, p }) => {
        if (!byCat[t.cat]) byCat[t.cat] = [];
        byCat[t.cat].push({ t, p });
      });
      Object.entries(byCat).forEach(([cat, arr]) => {
        ctx.strokeStyle = CAT[cat].color;
        arr.forEach((a, i) => {
          arr.slice(i + 1).forEach(b => {
            const alpha = Math.max(0, (a.p.z + b.p.z) / 2 * 0.15 + 0.05);
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.p.x, a.p.y);
            ctx.lineTo(b.p.x, b.p.y);
            ctx.stroke();
          });
        });
      });
      ctx.globalAlpha = 1;

      // Draw nodes
      projected.forEach(({ t, p }) => {
        const depthAlpha = 0.35 + (p.z + 1) * 0.325; // z from -1..1
        const r = t.r * p.scale * 0.9;

        // halo
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        grd.addColorStop(0, hexToRgba(CAT[t.cat].color, 0.4 * depthAlpha));
        grd.addColorStop(1, hexToRgba(CAT[t.cat].color, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // node
        ctx.fillStyle = hexToRgba(CAT[t.cat].color, depthAlpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // label
        ctx.fillStyle = `rgba(244, 244, 245, ${depthAlpha})`;
        ctx.font = `${Math.max(10, 11 * p.scale)}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.label, p.x, p.y + r + 14 * p.scale);
      });

      requestAnimationFrame(animate);
    };

    const hexToRgba = (hex, a) => {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    resize();
    window.addEventListener('resize', resize);
    animate();
  }

  /* ============================================================
     9. Active nav link on scroll
     ============================================================ */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => navIO.observe(s));

})();
