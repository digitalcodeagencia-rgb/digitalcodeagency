/* =========================================================================
   DIGITAL CODE — main.js
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- CONFIG: reemplaza estos datos por los reales de la agencia --------- */
  const CONFIG = {
    whatsappNumber: '573197055753', // TODO: reemplazar por el número real (formato: 57 + número, sin + ni espacios)
    email: 'digitalcode.agencia@gmail.com', // TODO: reemplazar por el correo real
    instagram: 'https://instagram.com/digitalcode',
    facebook: 'https://facebook.com/digitalcode',
    linkedin: 'https://linkedin.com/company/digitalcode'
  };
  window.DIGITAL_CODE_CONFIG = CONFIG;

  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavbar();
    initSmoothAnchors();
    initReveal();
    initCounters();
    initServiceGlow();
    initPortfolioFilter();
    initProjectCarousels();
    initTestimonials();
    initFAQ();
    initBackToTop();
    initContactForm();
    initWhatsAppLinks();
    initTerminalTyping();
    initYear();
  });

  /* ------------------------------- LOADER -------------------------------- */
  function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    const hide = () => loader.classList.add('done');
    window.addEventListener('load', () => setTimeout(hide, 500));
    setTimeout(hide, 2200); // failsafe
  }

  /* --------------------------- CURSOR PERSONALIZADO ------------------------ */
  function initCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    let rx = 0, ry = 0, tx = 0, ty = 0;

    window.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      tx = e.clientX; ty = e.clientY;
    });

    (function loop() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    const interactive = 'a, button, .btn, .service-card, .project-card, .founder-card, input, textarea, .faq-q';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactive)) ring.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactive)) ring.classList.remove('is-active');
    });
  }

  /* --------------------------------- NAVBAR -------------------------------- */
  function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = Array.from(links)
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((a) => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ------------------------------ SCROLL REVEAL ---------------------------- */
  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => entry.target.classList.add('in'), Number(delay));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    items.forEach((el) => obs.observe(el));
  }

  /* -------------------------- CONTADORES ANIMADOS -------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const animate = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = el.getAttribute('data-count').includes('.') ? 1 : 0;
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => obs.observe(c));
  }

  /* --------------------------- BRILLO EN SERVICIOS -------------------------- */
  function initServiceGlow() {
    document.querySelectorAll('.service-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  /* ------------------------------ FILTRO PORTAFOLIO ------------------------- */
  function initPortfolioFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        cards.forEach((card) => {
          const match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* --------------------------- CARRUSEL DE PROYECTOS -------------------------
     Componente único y reutilizable: recorre cada [data-carousel], lee su
     carpeta de imágenes (data-folder) y su lista de archivos (data-images en
     JSON) y construye un carrusel nativo (sin librerías externas) con botones
     Anterior / Siguiente, indicadores (puntos) y transición suave por CSS. */
  function initProjectCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    if (!carousels.length) return;

    carousels.forEach((el) => buildCarousel(el));

    function buildCarousel(el) {
      const folder = el.getAttribute('data-folder') || '';
      const alt = el.getAttribute('data-alt') || 'Proyecto';
      let files = [];
      try {
        files = JSON.parse(el.getAttribute('data-images') || '[]');
      } catch (e) {
        files = [];
      }
      if (!files.length) return;

      // ---- Estructura del carrusel ----
      const track = document.createElement('div');
      track.className = 'carousel-track';

      files.forEach((file, i) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = `${folder}/${encodeURIComponent(file)}`;
        img.alt = `${alt} ${i + 1}`;
        img.loading = 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);
      });
      el.appendChild(track);

      let index = 0;
      let dots = null;

      // Solo se agregan controles si hay más de una imagen
      if (files.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'carousel-btn carousel-prev';
        prevBtn.setAttribute('aria-label', 'Anterior');
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'carousel-btn carousel-next';
        nextBtn.setAttribute('aria-label', 'Siguiente');
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'carousel-dots';
        files.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(i);
          });
          dotsWrap.appendChild(dot);
        });

        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          goTo(index - 1);
        });
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          goTo(index + 1);
        });

        el.appendChild(prevBtn);
        el.appendChild(nextBtn);
        el.appendChild(dotsWrap);
        dots = dotsWrap.querySelectorAll('.carousel-dot');
      }

      function goTo(newIndex) {
        const total = files.length;
        index = ((newIndex % total) + total) % total; // circular
        track.style.transform = `translateX(-${index * 100}%)`;
        if (dots) {
          dots.forEach((d, i) => d.classList.toggle('active', i === index));
        }
      }
    }
  }

  /* -------------------------------- TESTIMONIOS ----------------------------- */
  function initTestimonials() {
    const slides = document.querySelectorAll('.testi-slide');
    const dots = document.querySelectorAll('.testi-dots button');
    if (!slides.length) return;
    let idx = 0;
    let timer;

    function show(i) {
      slides.forEach((s) => s.classList.remove('active'));
      dots.forEach((d) => d.classList.remove('active'));
      slides[i].classList.add('active');
      if (dots[i]) dots[i].classList.add('active');
      idx = i;
    }

    function next() {
      show((idx + 1) % slides.length);
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        show(i);
        restart();
      });
    });

    show(0);
    restart();
  }

  /* ------------------------------------ FAQ --------------------------------- */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-a').style.maxHeight = null;
          }
        });
        if (isOpen) {
          item.classList.remove('open');
          a.style.maxHeight = null;
        } else {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------------------------- SUBIR --------------------------------- */
  function initBackToTop() {
    const btn = document.querySelector('.top-btn');
    if (!btn) return;
    window.addEventListener(
      'scroll',
      () => btn.classList.toggle('show', window.scrollY > 560),
      { passive: true }
    );
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ------------------------------ FORMULARIO -> WHATSAPP --------------------- */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;
    const success = document.querySelector('.form-success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = form.querySelectorAll('[required]');
      fields.forEach((field) => {
        const empty = !field.value.trim();
        const invalidEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        field.classList.toggle('is-invalid', empty || invalidEmail);
        if (empty || invalidEmail) valid = false;
      });
      if (!valid) return;

      const data = Object.fromEntries(new FormData(form).entries());
      const lines = [
        '*Nueva solicitud desde la web — Digital Code*',
        `Nombre: ${data.nombre || '-'}`,
        `Empresa: ${data.empresa || '-'}`,
        `Correo: ${data.correo || '-'}`,
        `WhatsApp: ${data.whatsapp || '-'}`,
        '',
        data.mensaje || ''
      ];
      const text = encodeURIComponent(lines.join('\n'));
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;

      if (success) success.classList.add('show');
      window.open(url, '_blank');
      form.reset();
      setTimeout(() => success && success.classList.remove('show'), 6000);
    });

    form.querySelectorAll('.form-control').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });
  }

  /* --------------------------- ENLACES DE WHATSAPP --------------------------- */
  function initWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
      const msg = el.getAttribute('data-whatsapp-link') || 'Hola Digital Code, quiero cotizar un proyecto web.';
      el.setAttribute('href', `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    document.querySelectorAll('[data-mail-link]').forEach((el) => {
      el.setAttribute('href', `mailto:${CONFIG.email}`);
    });
    document.querySelectorAll('[data-social="instagram"]').forEach((el) => (el.href = CONFIG.instagram));
    document.querySelectorAll('[data-social="facebook"]').forEach((el) => (el.href = CONFIG.facebook));
    document.querySelectorAll('[data-social="linkedin"]').forEach((el) => (el.href = CONFIG.linkedin));
  }

  /* ---------------------------- TERMINAL — TYPING ---------------------------- */
  function initTerminalTyping() {
    const el = document.querySelector('.terminal-body[data-typing]');
    if (!el) return;
    const original = el.innerHTML;
    // We keep the pre-authored markup visible immediately for reduced-motion / no-JS users,
    // and only replay a lightweight caret blink loop, avoiding re-parsing risk with innerHTML typing.
    const caret = el.querySelector('.type-cursor');
    if (!caret) return;
  }

  function initYear() {
    const el = document.querySelector('#current-year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
