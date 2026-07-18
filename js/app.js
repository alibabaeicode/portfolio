(() => {
  const ARROW_ICON = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#0a0a0a" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const HERO_A = 9, HERO_B = 14, FEAT_A = 17, FEAT_B = 20, FEAT_C = 3, FEAT_D = 11;

  const state = {
    view: 'home', // home | gallery | about | contact
    lightboxIndex: null,
  };

  const viewEl = document.getElementById('view');
  const lightboxEl = document.getElementById('lightbox');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  const label = (i) => 'No. ' + String(i + 1).padStart(2, '0');

  function tile(index, className) {
    const p = PAINTINGS[index];
    return `<div class="image-tile ${className}" data-action="openLightbox" data-index="${index}">
      <img src="${p.src}" alt="Ali Babaei painting, ${label(index)}" loading="lazy" />
    </div>`;
  }

  function renderHome() {
    return `<section class="page home">
      <div class="home-sidebar">
        <h1 class="home-name">Ali<br />Babaei</h1>
        <p class="home-tagline">Painter working between portraiture, collage and raw mark-making — one canvas at a time.</p>
        <div class="home-links">
          <div class="icon-link" data-action="goGallery" tabindex="0" role="button">
            ${ARROW_ICON}<span>View Work</span>
          </div>
          <div class="icon-link" data-action="goAbout" tabindex="0" role="button">
            ${ARROW_ICON}<span>The Practice</span>
          </div>
        </div>
        <div class="pill-button" data-action="goContact" tabindex="0" role="button">
          <span>Share A Thought</span>
        </div>
      </div>

      <div class="home-content">
        ${tile(HERO_A, 'tile-hero-a')}

        <div class="home-row">
          <div class="tile-hero-b">${tile(HERO_B, 'tile-hero-b')}</div>
          <div class="home-row-text">
            <h2 class="home-h2">Held Gaze</h2>
            <p>A face caught mid-thought, before it decides what to become.</p>
          </div>
        </div>

        <div class="home-grid3">
          ${tile(FEAT_A, 'tile-feat')}
          ${tile(FEAT_B, 'tile-feat')}
          ${tile(FEAT_C, 'tile-feat')}
        </div>

        <div class="home-statement">
          <div>The mark is the subject.</div>
        </div>

        ${tile(FEAT_D, 'tile-feat-d')}

        <p class="home-closing">No likeness survives contact. Only residue — color, contour, the memory of a face.</p>
      </div>
    </section>`;
  }

  function renderGallery() {
    const posters = PAINTINGS.map((p, i) => {
      const dark = i % 3 === 2;
      return `<div class="poster${dark ? ' dark' : ''}" data-action="openLightbox" data-index="${i}">
        <div class="poster-head">
          <span>${label(i)}</span>
          <span>Ali Babaei</span>
        </div>
        <div class="poster-image">
          <img src="${p.src}" alt="Ali Babaei painting ${label(i)}" loading="lazy" />
        </div>
      </div>`;
    }).join('');

    return `<section class="page gallery">
      <h1>Selected Work</h1>
      <div class="gallery-grid">${posters}</div>
    </section>`;
  }

  function renderAbout() {
    return `<section class="page about">
      <h1>About</h1>
      <p>I exist as a brief clearing between two vast darknesses. Everything I make is an attempt to understand what that brief opening reveals.</p>
      <p>I didn't choose the machinery that became me. It was assembled long before I arrived—by evolution, culture, memory, accident, and countless invisible forces. Rather than searching for certainty, I try to observe that machinery while it's running—not to escape it, but to see it clearly.</p>
      <p>I don't believe the self is singular. What I call “I” is a shifting negotiation between instincts, memories, desires, fears, and borrowed voices. My work is where those contradictions become visible.</p>
      <p>Through painting, design, and ideas, I explore the hidden architectures beneath human experience—the patterns that shape perception before perception becomes thought, and thought becomes belief.</p>
      <p>I don't make art to illustrate conclusions. I make it because looking carefully is one of the few honest things I know how to do.</p>
      <p>If my work has a subject, it is this strange condition of being a universe becoming aware of itself for a moment—curious enough to ask questions it may never answer.</p>
    </section>`;
  }

  function renderContact() {
    return `<section class="page contact">
      <h1>Let's<br>Talk</h1>
      <p class="contact-note">Got a thought living in the same space as these paintings — one that could become a new piece? Share it by email.</p>
      <a href="mailto:alibabaei.design@gmail.com" data-action="growCursorLink">alibabaei.design@gmail.com</a>
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
    lightboxEl.innerHTML = `<div class="lightbox-inner" data-action="stopProp">
        <img src="${p.src}" alt="Selected painting, ${label(state.lightboxIndex)}" />
        <div class="lightbox-label">${label(state.lightboxIndex)}</div>
      </div>
      <div class="lightbox-close" data-action="closeLightbox" tabindex="0" role="button">Close &#10005;</div>
      <div class="lightbox-prev" data-action="prevImage" tabindex="0" role="button">&#8592;</div>
      <div class="lightbox-next" data-action="nextImage" tabindex="0" role="button">&#8594;</div>`;
  }

  function setView(view) {
    state.view = view;
    renderView();
    renderNav();
    window.scrollTo(0, 0);
  }

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
    goHome: () => setView('home'),
    goGallery: () => setView('gallery'),
    goAbout: () => setView('about'),
    goContact: () => setView('contact'),
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

  document.getElementById('nav-logo').addEventListener('click', () => setView('home'));
  document.getElementById('nav-work').addEventListener('click', () => setView('gallery'));
  document.getElementById('nav-about').addEventListener('click', () => setView('about'));
  document.getElementById('nav-contact').addEventListener('click', () => setView('contact'));

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

  renderView();
  renderNav();
  renderLightbox();
})();
