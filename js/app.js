(() => {
  const ARROW_ICON = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#0a0a0a" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const state = {
    view: 'home', // home | gallery | about | contact
    lightboxIndex: null,
  };

  // Content (paintings, home/about/contact copy) lives in content/*.json,
  // editable via the CMS at /admin — see CMS_SETUP.md. Populated by
  // loadContent() before the first render.
  let PAINTINGS = [];
  let HOME = {};
  let ABOUT = {};
  let CONTACT = {};

  const viewEl = document.getElementById('view');
  const lightboxEl = document.getElementById('lightbox');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  const label = (i) => 'No. ' + String(i + 1).padStart(2, '0');

  // CMS-authored strings land in innerHTML, so escape them — a title or
  // paragraph typed into the CMS could contain &, <, >, or quote characters.
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  // Home's featured images are stored by src (not array index) in
  // content/home.json, so re-curating/reordering paintings in the CMS
  // can't silently point the hero/feature slots at the wrong image.
  function indexBySrc(src, fallback) {
    const i = PAINTINGS.findIndex((p) => p.src === src);
    return i === -1 ? fallback : i;
  }

  function tile(index, className) {
    const p = PAINTINGS[index];
    return `<div class="image-tile ${className}" data-action="openLightbox" data-index="${index}">
      <img src="${esc(p.src)}" alt="Ali Babaei painting, ${label(index)} — ${esc(p.title)}" loading="lazy" />
    </div>`;
  }

  function renderHome() {
    const heroA = indexBySrc(HOME.heroSrc, 0);
    const heroB = indexBySrc(HOME.heroBSrc, 0);
    const featD = indexBySrc(HOME.featDSrc, 0);
    const feat = (HOME.featSrcs || []).map((src) => indexBySrc(src, 0));

    return `<section class="page home">
      <div class="home-sidebar">
        <div class="home-sidebar-top">
          <h1 class="home-name">Ali<br />Babaei</h1>
          <p class="home-tagline">${esc(HOME.tagline)}</p>
          <div class="home-links">
            <div class="icon-link" data-action="goGallery" tabindex="0" role="button">
              ${ARROW_ICON}<span>View Work</span>
            </div>
            <div class="icon-link" data-action="goAbout" tabindex="0" role="button">
              ${ARROW_ICON}<span>The Vision</span>
            </div>
          </div>
        </div>
        <div class="pill-button" data-action="goContact" tabindex="0" role="button">
          <span>Share A Thought</span>
        </div>
      </div>

      <div class="home-content">
        ${tile(heroA, 'tile-hero-a')}

        <div class="home-row">
          <div class="tile-hero-b">${tile(heroB, 'tile-hero-b')}</div>
          <div class="home-row-text">
            <h2 class="home-h2">${esc(HOME.rowHeading)}</h2>
            <p>${esc(HOME.rowText)}</p>
          </div>
        </div>

        <div class="home-grid3">
          ${feat.map((i) => tile(i, 'tile-feat')).join('')}
        </div>

        <div class="home-statement">
          <div>${esc(HOME.statement)}</div>
        </div>

        ${tile(featD, 'tile-feat-d')}

        <p class="home-closing">${esc(HOME.closing)}</p>
      </div>
    </section>`;
  }

  function renderGallery() {
    const posters = PAINTINGS.map((p, i) => {
      const dark = i % 3 === 2;
      return `<div class="poster${dark ? ' dark' : ''}" data-action="openLightbox" data-index="${i}">
        <div class="poster-head">
          <span>${label(i)}</span>
          <span>${esc(p.title)}</span>
        </div>
        <div class="poster-image">
          <img src="${esc(p.src)}" alt="Ali Babaei painting, ${label(i)} — ${esc(p.title)}" loading="lazy" />
        </div>
      </div>`;
    }).join('');

    return `<section class="page gallery">
      <h1>Selected Work</h1>
      <div class="gallery-grid">${posters}</div>
    </section>`;
  }

  function renderAbout() {
    const paragraphs = (ABOUT.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('\n      ');
    return `<section class="page about">
      <h1>About</h1>
      ${paragraphs}
    </section>`;
  }

  function renderContact() {
    return `<section class="page contact">
      <h1>Let's<br>Talk</h1>
      <p class="contact-note">${esc(CONTACT.note)}</p>
      <a href="mailto:${esc(CONTACT.email)}" data-action="growCursorLink">${esc(CONTACT.email)}</a>
    </section>`;
  }

  function renderView() {
    switch (state.view) {
      case 'gallery': viewEl.innerHTML = renderGallery(); break;
      case 'about': viewEl.innerHTML = renderAbout(); break;
      case 'contact': viewEl.innerHTML = renderContact(); break;
      default: viewEl.innerHTML = renderHome();
    }
  }

  function renderNav() {
    document.getElementById('nav-work').classList.toggle('active', state.view === 'gallery');
    document.getElementById('nav-about').classList.toggle('active', state.view === 'about');
    document.getElementById('nav-contact').classList.toggle('active', state.view === 'contact');
  }

  function renderLightbox() {
    if (state.lightboxIndex === null) {
      lightboxEl.hidden = true;
      lightboxEl.innerHTML = '';
      return;
    }
    const p = PAINTINGS[state.lightboxIndex];
    lightboxEl.hidden = false;
    lightboxEl.style.opacity = '';
    lightboxEl.innerHTML = `<div class="lightbox-inner" data-action="stopProp">
        <img src="${p.src}" alt="Selected painting, ${label(state.lightboxIndex)} — ${p.title}" />
        <div class="lightbox-label">${label(state.lightboxIndex)} — ${p.title}</div>
      </div>
      <div class="lightbox-close" data-action="closeLightbox" tabindex="0" role="button">Close &#10005;</div>
      <div class="lightbox-prev" data-action="prevImage" tabindex="0" role="button">&#8592;</div>
      <div class="lightbox-next" data-action="nextImage" tabindex="0" role="button">&#8594;</div>`;
  }

  // Each page gets its own URL (#work, #about, #contact — home stays hash-
  // free) so tools like Clarity can tell pages apart and build funnels
  // across them. No server-side routing needed since only the hash
  // changes; navigate() is what callers use, setView() is the renderer.
  const HASH_FOR_VIEW = { home: '', gallery: 'work', about: 'about', contact: 'contact' };
  const VIEW_FOR_HASH = { '': 'home', work: 'gallery', about: 'about', contact: 'contact' };
  const TITLE_FOR_VIEW = {
    home: 'Ali Babaei — Designer & Painter',
    gallery: 'Work — Ali Babaei',
    about: 'About — Ali Babaei',
    contact: 'Contact — Ali Babaei',
  };

  function setView(view) {
    state.view = view;
    renderView();
    renderNav();
    document.title = TITLE_FOR_VIEW[view] || TITLE_FOR_VIEW.home;
    window.scrollTo(0, 0);
  }

  function viewFromHash() {
    return VIEW_FOR_HASH[location.hash.slice(1)] || 'home';
  }

  function navigate(view) {
    const hash = HASH_FOR_VIEW[view] || '';
    if (location.hash.slice(1) === hash) {
      setView(view);
    } else {
      location.hash = hash;
    }
  }

  window.addEventListener('hashchange', () => setView(viewFromHash()));

  function openLightbox(index) {
    state.lightboxIndex = index;
    renderLightbox();
  }
  function closeLightbox() {
    state.lightboxIndex = null;
    renderLightbox();
  }
  function stepImage(delta) {
    if (state.lightboxIndex === null) return;
    state.lightboxIndex = (state.lightboxIndex + delta + PAINTINGS.length) % PAINTINGS.length;
    renderLightbox();
  }

  const ACTIONS = {
    goHome: () => navigate('home'),
    goGallery: () => navigate('gallery'),
    goAbout: () => navigate('about'),
    goContact: () => navigate('contact'),
    openLightbox: (el) => openLightbox(Number(el.dataset.index)),
    closeLightbox: () => closeLightbox(),
    prevImage: () => stepImage(-1),
    nextImage: () => stepImage(1),
    stopProp: () => {},
    growCursorLink: () => {},
  };

  function dispatch(el, evt) {
    const action = ACTIONS[el.dataset.action];
    if (!action) return;
    evt.preventDefault();
    action(el);
  }

  // Swipe-down-to-dismiss on the lightbox (touch only — mirrors iOS Photos).
  // Bound on the persistent lightboxEl, not its innerHTML, so it survives
  // renderLightbox() re-rendering the image on open/next/prev.
  const DISMISS_DISTANCE = 110;
  let dragStartX = null, dragStartY = null, dragY = 0, dragging = false;

  lightboxEl.addEventListener('touchstart', (e) => {
    const inner = e.target.closest('.lightbox-inner');
    if (!inner || state.lightboxIndex === null) return;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
    dragY = 0;
    dragging = true;
    inner.classList.add('dragging');
  }, { passive: true });

  lightboxEl.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - dragStartX;
    const dy = e.touches[0].clientY - dragStartY;
    if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) return; // downward + mostly-vertical only
    e.preventDefault();
    dragY = dy;
    const inner = lightboxEl.querySelector('.lightbox-inner');
    if (inner) inner.style.transform = `translateY(${dy}px)`;
    lightboxEl.style.opacity = String(Math.max(1 - dy / 400, 0.4));
  }, { passive: false });

  lightboxEl.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    const inner = lightboxEl.querySelector('.lightbox-inner');
    if (inner) inner.classList.remove('dragging');
    if (dragY > DISMISS_DISTANCE) {
      if (inner) inner.style.transform = `translateY(${dragY + 200}px)`;
      lightboxEl.style.opacity = '0';
      setTimeout(closeLightbox, 200);
    } else {
      if (inner) inner.style.transform = '';
      lightboxEl.style.opacity = '';
    }
    dragStartX = null; dragStartY = null; dragY = 0;
  });

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    dispatch(el, e);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.lightboxIndex !== null) {
      closeLightbox();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.action) {
      dispatch(e.target, e);
    }
  });

  document.getElementById('nav-logo').addEventListener('click', () => navigate('home'));
  document.getElementById('nav-work').addEventListener('click', () => navigate('gallery'));
  document.getElementById('nav-about').addEventListener('click', () => navigate('about'));
  document.getElementById('nav-contact').addEventListener('click', () => navigate('contact'));

  // Custom cursor: a 6px dot plus a 28px ring that grows to 64px over any
  // interactive element (mirrors the source design's cursor-follow behavior).
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('[data-action], a, [role="button"]')) {
      cursorRing.classList.add('grow');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-action], a, [role="button"]')) {
      cursorRing.classList.remove('grow');
    }
  });

  // Content is fetched (not inlined) so the CMS at /admin can edit it as
  // plain JSON files without touching this script. Listeners above are
  // safe to bind before this resolves (PAINTINGS/HOME/etc. just start
  // empty); the render below is what actually shows real content.
  function loadContent() {
    return Promise.all([
      fetch('content/paintings.json', { cache: 'no-store' }).then((r) => r.json()),
      fetch('content/home.json', { cache: 'no-store' }).then((r) => r.json()),
      fetch('content/about.json', { cache: 'no-store' }).then((r) => r.json()),
      fetch('content/contact.json', { cache: 'no-store' }).then((r) => r.json()),
    ]).then(([paintingsData, homeData, aboutData, contactData]) => {
      PAINTINGS = paintingsData.paintings;
      HOME = homeData;
      ABOUT = aboutData;
      CONTACT = contactData;
      setView(viewFromHash());
    }).catch((err) => {
      console.error('Failed to load site content', err);
      viewEl.innerHTML = '<section class="page"><p>Something went wrong loading the page. Please refresh.</p></section>';
    });
  }

  loadContent();
  renderLightbox();
})();
