// Jaque Laminado y Pintura Automotriz — interacciones del sitio

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('done'), 500);
  });
  // Fallback por si "load" tarda (ej. mapa lento)
  setTimeout(() => loader && loader.classList.add('done'), 3000);

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mob.classList.contains('open');
    mob.classList.toggle('open', isOpen);
    ham.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', String(isOpen));
  };
  ham && ham.addEventListener('click', () => toggleMenu());
  mob && mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ---------- Reveal on scroll ---------- */
  const revEls = document.querySelectorAll('.rev');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revEls.forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-count') ?? el.getAttribute('data-hero-count'));
    if (isNaN(target)) return;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterEls = document.querySelectorAll('[data-count], [data-hero-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => countIO.observe(el));

  /* ---------- Typewriter ---------- */
  const twText = document.getElementById('twText');
  if (twText) {
    const words = ['Hojalatería', 'Pintura Automotriz', 'Pulido', 'Encerado', 'Reparación de Rines'];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        ci++;
        twText.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        ci--;
        twText.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(tick, deleting ? 40 : 75);
    };
    tick();
  }

  /* ---------- Particle canvases ---------- */
  const setupParticles = (id, opts = {}) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const count = opts.count || 46;
    const color = opts.color || '123,47,247';

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };
    const init = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.15
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  };
  setupParticles('pcanvas', { count: 60, color: '150,90,255' });
  setupParticles('pcanvasWhy', { count: 40, color: '108,43,217' });
  setupParticles('pcanvasGaleria', { count: 40, color: '47,178,224' });

  /* ---------- Formulario a WhatsApp ---------- */
  const WHATSAPP_NUMBER = '529511190541';
  const form = document.getElementById('cForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const nombre = form.nombre.value.trim();
      const telefono = form.telefono.value.trim();
      const tipo = form.tipo.value;
      const mensaje = form.mensaje.value.trim();

      let text = `Hola, quiero solicitar una cotización.%0A%0A`;
      text += `*Nombre:* ${encodeURIComponent(nombre)}%0A`;
      text += `*Teléfono:* ${encodeURIComponent(telefono)}%0A`;
      text += `*Servicio:* ${encodeURIComponent(tipo)}%0A`;
      if (mensaje) text += `*Detalle:* ${encodeURIComponent(mensaje)}%0A`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
      form.reset();
    });
  }
});
