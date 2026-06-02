/* ============================================
   Lenvi — Premium JS
   ============================================ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Helpers ── */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ══════════════════════════════════════════
     1. HERO CANVAS — particle constellation
  ══════════════════════════════════════════ */
  (function initCanvas() {
    const canvas = $('#hero-canvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles, raf;
    const COUNT = window.innerWidth < 768 ? 40 : 70;
    const MAX_DIST = 130;
    const COLOR = '196,154,92';

    function resize() {
      /* Use parent section dimensions — canvas.offsetWidth can return 0
         when canvas has no intrinsic size before layout */
      const hero = canvas.parentElement;
      W = canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
      H = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5;
        if (p.y > H + 5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${COLOR},${(1 - dist / MAX_DIST) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    requestAnimationFrame(() => {
      init();
      draw();
    });

    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(canvas);
  })();


  /* ══════════════════════════════════════════
     2. CUSTOM CURSOR
  ══════════════════════════════════════════ */
  (function initCursor() {
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;
    const ring = $('#cursorRing');
    const dot  = $('#cursorDot');
    if (!ring || !dot) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    const interactable = 'a, button, .btn, .faq-item summary, .step, .hero-card, .cta-channel';
    document.querySelectorAll(interactable).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  })();


  /* ══════════════════════════════════════════
     3. SCROLL PROGRESS BAR
  ══════════════════════════════════════════ */
  (function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  })();


  /* ══════════════════════════════════════════
     4. HEADER — scroll state
  ══════════════════════════════════════════ */
  (function initHeader() {
    const header = $('#siteHeader');
    if (!header) return;
    const toggle = () => header.classList.toggle('scrolled', window.scrollY > 60);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  })();


  /* ══════════════════════════════════════════
     5. MOBILE NAV
  ══════════════════════════════════════════ */
  (function initMobileNav() {
    const btn = $('#hamburger');
    const nav = $('#mobileNav');
    if (!btn || !nav) return;

    function open() {
      btn.classList.add('is-active');
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
      nav.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      btn.classList.remove('is-active');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      nav.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => btn.classList.contains('is-active') ? close() : open());

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();


  /* ══════════════════════════════════════════
     6. REVEAL ON SCROLL
  ══════════════════════════════════════════ */
  (function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  })();


  /* ══════════════════════════════════════════
     7. COUNTER ANIMATION
  ══════════════════════════════════════════ */
  (function initCounters() {
    const counters = $$('.stat-number');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
  })();


  /* ══════════════════════════════════════════
     8. 3D CARD TILT
  ══════════════════════════════════════════ */
  (function initTilt() {
    if (prefersReducedMotion) return;
    const cards = $$('.tilt-card');

    cards.forEach(card => {
      const intensity = card.classList.contains('hero-card') ? 12 : 8;

      card.addEventListener('mousemove', e => {
        card.style.transition = 'box-shadow 0.3s, background 0.3s';
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
        const ry = ((e.clientX - cx) / (rect.width / 2)) * intensity;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s, background 0.3s';
        card.style.transform = '';
      });
    });
  })();


  /* ══════════════════════════════════════════
     9. MAGNETIC BUTTONS
  ══════════════════════════════════════════ */
  (function initMagnetic() {
    if (prefersReducedMotion) return;
    const btns = $$('.magnetic');

    btns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  })();


  /* ══════════════════════════════════════════
     10. SMOOTH SCROLL — nav links
  ══════════════════════════════════════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ══════════════════════════════════════════
     11. ACTIVE NAV LINK ON SCROLL
  ══════════════════════════════════════════ */
  (function initActiveNav() {
    const navLinks = $$('.nav-links a');
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    function update() {
      const scrollY = window.scrollY + 120;
      let active = sections[0];
      sections.forEach(s => { if (s.offsetTop <= scrollY) active = s; });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + active.id
          ? 'var(--gold-light)'
          : '';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

})();
