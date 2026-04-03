/**
 * JOHNSLEY DESULMA — Portfolio
 * Main JavaScript — All interactions & animations
 */

(function () {
  'use strict';

  /* ============================================================
     EMAIL CONFIGURATION
     Replace the three placeholders below with your credentials
     from https://www.email.com/
     ============================================================ */
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  /* ============================================================
     NAVBAR — scroll behaviour + active link + burger
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll → add .scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }, { passive: true });

  // Burger toggle
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navBurger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link based on scroll position
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     PARTICLE CANVAS — Hero background
     ============================================================ */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.6 ? '124,58,237' : '0,212,255'
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Move
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    animFrame = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  }, { passive: true });

  /* ============================================================
     TYPEWRITER EFFECT — Hero title
     ============================================================ */
  const typewriterEl = document.getElementById('typewriter');
  const words = ['Backend', 'Web', 'IA & Machine Learning', 'Cybersecurite'];
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let typeDelay = 120;

  function typeWriter() {
    const current = words[wordIdx];

    if (!deleting) {
      typewriterEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        typeDelay = 1800;
      } else {
        typeDelay = 110;
      }
    } else {
      typewriterEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typeDelay = 400;
      } else {
        typeDelay = 60;
      }
    }
    setTimeout(typeWriter, typeDelay);
  }
  setTimeout(typeWriter, 800);

  /* ============================================================
     COUNTER ANIMATION — Hero stats
     ============================================================ */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = start;
    }, 16);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;
  function checkStats() {
    if (statsAnimated) return;
    const heroSection = document.getElementById('hero');
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      statsAnimated = true;
      statNums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target, 1400);
      });
    }
  }
  window.addEventListener('scroll', checkStats, { passive: true });
  checkStats();

  /* ============================================================
     INTERSECTION OBSERVER — Reveal elements on scroll
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) delay = i * 90;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ============================================================
     SKILL BAR ANIMATION — Fill on scroll
     ============================================================ */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ============================================================
     CONTACT FORM — Validation + EmailJS submission
     ============================================================ */
  // Init EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');

  function validateField(inputId, errorId, condition) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const group = input ? input.closest('.form-group') : null;
    if (!input || !group) return true;
    if (condition(input.value.trim())) {
      group.classList.remove('error');
      return true;
    } else {
      group.classList.add('error');
      return false;
    }
  }

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  if (form) {
    // Live validation on blur
    document.getElementById('contactName').addEventListener('blur', () => {
      validateField('contactName', 'nameError', v => v.length >= 2);
    });
    document.getElementById('contactEmail').addEventListener('blur', () => {
      validateField('contactEmail', 'emailError', isValidEmail);
    });
    document.getElementById('contactMessage').addEventListener('blur', () => {
      validateField('contactMessage', 'messageError', v => v.length >= 10);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const validName = validateField('contactName', 'nameError', v => v.length >= 2);
      const validEmail = validateField('contactEmail', 'emailError', isValidEmail);
      const validMessage = validateField('contactMessage', 'messageError', v => v.length >= 10);

      if (!validName || !validEmail || !validMessage) return;

      // Loading state
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline';
      successEl.style.display = 'none';
      errorEl.style.display = 'none';

      const templateParams = {
        from_name: document.getElementById('contactName').value.trim(),
        from_email: document.getElementById('contactEmail').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
        to_name: 'JOHNSLEY DESULMA'
      };

      try {
        if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        }
        // Show success
        successEl.style.display = 'block';
        form.reset();
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      } catch (err) {
        errorEl.style.display = 'block';
        console.error('EmailJS error:', err);
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL — All anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     PARALLAX EFFECT — Hero background subtle movement
     ============================================================ */
  const heroSection = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroSection && scrollY < window.innerHeight) {
      const translateY = scrollY * 0.25;
      heroSection.style.setProperty('--parallax-y', `${translateY}px`);
    }
  }, { passive: true });

  /* ============================================================
     PROJECT CARD TILT — Subtle 3-D on mouse move
     ============================================================ */
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    });
  });

})();
