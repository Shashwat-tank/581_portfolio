(() => {
  const root = document.documentElement;

  // Theme toggle (remembered per browser; safe if storage is blocked)
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  document.getElementById('themeBtn').addEventListener('click', () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  // Mobile menu
  const nav = document.getElementById('nav'), mb = document.getElementById('menuBtn');
  mb.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    mb.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false');
  }));

  // Scroll progress
  const bar = document.getElementById('bar');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Active section highlighting (top nav + process rail)
  const spy = (links) => {
    const map = new Map();
    links.forEach(a => { const el = document.querySelector(a.getAttribute('href')); if (el) map.set(el, a); });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          map.get(e.target).classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    map.forEach((_, el) => io.observe(el));
  };
  spy([...document.querySelectorAll('#nav a')]);
  spy([...document.querySelectorAll('.rail a')]);

  // Before / after toggles
  document.querySelectorAll('[data-ba]').forEach(box => {
    const a = box.querySelector('[data-a]'), b = box.querySelector('[data-b]');
    box.querySelectorAll('.seg button').forEach(btn => btn.addEventListener('click', () => {
      box.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-pressed', x === btn));
      const showB = btn.dataset.v === 'b';
      a.hidden = showB; b.hidden = !showB;
    }));
  });

  // Lightbox
  const lb = document.getElementById('lb'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap');
  let last = null;
  const open = (img, cap) => {
    last = document.activeElement;
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lbCap.textContent = cap || img.alt;
    lb.hidden = false; lb.querySelector('.lb-close').focus();
  };
  const close = () => { lb.hidden = true; lbImg.src = ''; last && last.focus(); };
  document.querySelectorAll('.sketch img, .screen-fig img, .ba-frame img').forEach(img => {
    img.addEventListener('click', () => {
      const fc = img.closest('figure')?.querySelector('figcaption');
      open(img, fc ? fc.textContent : '');
    });
  });
  lb.addEventListener('click', e => { if (e.target !== lbImg) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });

})();
