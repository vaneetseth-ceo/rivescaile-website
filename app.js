/* ===== RiveScaile Interactive Scripts ===== */

(function() {
  'use strict';

  // ===== LUCIDE ICONS =====
  if (window.lucide) lucide.createIcons();

  // ===== THEME TOGGLE =====
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  }

  // ===== HEADER SCROLL BEHAVIOR =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ===== MOBILE NAV =====
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
  }

  window.closeMobile = function() {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  };

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal');

  // Check if scroll-driven animations are supported
  const hasScrollDriven = CSS.supports && CSS.supports('animation-timeline', 'scroll()');

  if (!hasScrollDriven) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // With native scroll-driven, just make them visible
    revealElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ===== TESTIMONIAL CAROUSEL =====
  const track = document.getElementById('testimonials-track');
  const navContainer = document.getElementById('testimonial-nav');

  if (track && navContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    const cardCount = cards.length;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      navContainer.appendChild(dot);
    });

    const dots = navContainer.querySelectorAll('.testimonial-dot');

    // Track active dot on scroll
    const trackObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(cards).indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle('active', i === index));
        }
      });
    }, {
      root: track,
      threshold: 0.6
    });

    cards.forEach(card => trackObserver.observe(card));
  }

  // ===== PARTICLE BACKGROUND =====
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((w * h) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);

      const isDark = root.getAttribute('data-theme') !== 'light';
      const particleColor = isDark ? '11, 95, 255' : '11, 95, 255';
      const lineColor = isDark ? '11, 95, 255' : '11, 95, 255';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    // Reduce motion check
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!reduceMotion.matches) {
      resize();
      createParticles();
      drawParticles();

      window.addEventListener('resize', () => {
        resize();
        createParticles();
      });
    }

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else if (!reduceMotion.matches) {
        drawParticles();
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== TERMINAL TYPING RESTART ON SCROLL INTO VIEW =====
  const terminal = document.querySelector('.hero-terminal');
  if (terminal) {
    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = terminal.querySelectorAll('.terminal-line');
          lines.forEach(line => {
            line.style.animation = 'none';
            line.offsetHeight; // trigger reflow
            line.style.animation = '';
          });
        }
      });
    }, { threshold: 0.5 });

    terminalObserver.observe(terminal);
  }

})();
