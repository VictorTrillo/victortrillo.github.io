// ============================
// THEME TOGGLE
// ============================
(function () {
  const root = document.documentElement;
  let theme = root.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);

  function updateToggleIcon(btn, t) {
    if (!btn) return;
    btn.innerHTML = t === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', `Cambiar a modo ${t === 'dark' ? 'claro' : 'oscuro'}`);
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    updateToggleIcon(btn, theme);
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      document.querySelectorAll('[data-theme-toggle]').forEach(b => updateToggleIcon(b, theme));
    });
  });
})();

// ============================
// MOBILE MENU
// ============================
(function () {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

// ============================
// SCROLL-AWARE HEADER
// ============================
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('header--scrolled', y > 10);
    header.classList.toggle('header--hidden', y > lastY && y > 80);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ============================
// ARTICLE FILTER (articulos.html)
// ============================
(function () {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.pub-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const tags = item.dataset.tags || '';
        if (filter === 'all' || tags.includes(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

// ============================
// SCROLL ANIMATIONS (fade-in)
// ============================
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll('.area-card, .article-card, .repo-card, .pub-item, .repo-card-full, .contact-method');
  if (!targets.length) return;

  targets.forEach(el => el.classList.add('fade-in'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => io.observe(el));
})();
