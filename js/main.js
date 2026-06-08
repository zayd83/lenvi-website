/* ============================================
   Lenvi — Main JS
   ============================================ */
(function () {
  'use strict';

  /* ── Scroll progress bar ── */
  var bar = document.getElementById('scrollBar');
  if (bar) {
    window.addEventListener('scroll', function () {
      var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ── Header scroll state ── */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav ── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var navBackdrop = document.getElementById('navBackdrop');
  var navClose = document.getElementById('navClose');

  function openNav() {
    mobileNav.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      mobileNav.classList.contains('open') ? closeNav() : openNav();
    });
    if (navClose) navClose.addEventListener('click', closeNav);
    if (navBackdrop) navBackdrop.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* ── Reveal on scroll ── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Count-up animation ── */
  var countEls = document.querySelectorAll('.count-up');
  if (countEls.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 1400;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { countObserver.observe(el); });
  }

  /* ── Hero canvas particles ── */
  (function initCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles, raf;
    var COUNT = window.innerWidth < 768 ? 45 : 80;
    var MAX_DIST = 120;
    var COLOR = '180,157,114';

    function resize() {
      var parent = canvas.parentElement;
      W = canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      H = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.4,
        opacity: Math.random() * 0.5 + 0.15
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5;
        if (p.y > H + 5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + COLOR + ',' + p.opacity + ')';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            var alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(' + COLOR + ',' + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (!raf) { init(); draw(); }
    }
    function stop() {
      cancelAnimationFrame(raf); raf = null;
    }

    /* Only animate when visible */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      });
      io.observe(canvas);
    } else {
      start();
    }

    window.addEventListener('resize', function () {
      resize();
      if (particles) particles = Array.from({ length: COUNT }, makeParticle);
    }, { passive: true });
  })();


})();
