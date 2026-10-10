/* Timeline Component JS
   - IntersectionObserver for reveal animations
   - Optional dataset-driven render (data-timeline JSON or inline markup)
*/
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Render timeline from inline JSON or external JSON source
  async function renderFromData() {
    const timelineList = document.querySelector('.timeline');
    if (!timelineList) {
      console.error('Timeline Error: .timeline list not found.');
      return;
    }
    const srcEl = document.querySelector('[data-timeline-src]');
    if (!srcEl) {
      console.log('Timeline Info: No data-timeline-src element found, using existing markup.');
      return;
    }

    const url = srcEl.getAttribute('data-timeline-src');
    if (!url) {
      console.error('Timeline Error: data-timeline-src attribute is empty.');
      return;
    }

    let data = [];
    try {
      console.log(`Timeline Info: Fetching data from ${url}`);
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.error(`Timeline Error: Failed to fetch data. Status: ${res.status} ${res.statusText}`);
        return;
      }
      data = await res.json();
      console.log(`Timeline Info: Successfully loaded ${data.length} items.`);
    } catch (e) {
      console.error('Timeline Error: Failed to parse JSON data.', e);
      return;
    }

    if (!data.length) {
      console.log('Timeline Info: Data source was empty, using existing markup.');
      return; // keep existing markup
    }

    // Clear any existing children and render anew
    while (timelineList.firstChild) timelineList.removeChild(timelineList.firstChild);

    data.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'timeline-item';

      const card = document.createElement('article');
      card.className = 'timeline-card';
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <div class="meta">
          <span class="year">${item.year || item.date || ''}</span>
        </div>
        <h3 class="headline">${item.title || ''}</h3>
        <p class="description">${item.description || ''}</p>
      `;

      li.appendChild(card);
      timelineList.appendChild(li);
    });
  }

  function setupObserver() {
    const items = Array.from(document.querySelectorAll('.timeline-item'));
    if (!items.length) return;

    if (prefersReduced) {
      items.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }
    );

    items.forEach((el) => io.observe(el));
  }

  // Immediately reveal items that are already in view on load
  function revealInitialVisible() {
    const items = Array.from(document.querySelectorAll('.timeline-item'));
    if (!items.length) return;
    const viewportTop = 0;
    const viewportBottom = window.innerHeight * 1.1; // a bit past the fold
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < viewportBottom && r.bottom > viewportTop) {
        el.classList.add('in-view');
      }
    });
  }

  // Scroll progress line on the center spine
  function setupProgress() {
    const list = document.querySelector('.timeline');
    if (!list) return;

    let ticking = false;
    let markers = [];

    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

    const recomputeMarkers = () => {
      const listRect = list.getBoundingClientRect();
      const items = Array.from(document.querySelectorAll('.timeline-item'));
      markers = items.map((el) => {
        const r = el.getBoundingClientRect();
        // position along the timeline relative to the list top
        const centerY = (r.top - listRect.top) + r.height / 2;
        return { el, y: centerY };
      });
    };

    const compute = () => {
      const rect = list.getBoundingClientRect();
      const h = rect.height;
      if (!h || h <= 0) {
        list.style.setProperty('--progress-px', '0px');
        return;
      }
      // Start filling when the viewport bottom crosses listTop + start threshold
      const start = window.innerHeight * 0.15; // px offset from list top
      const viewportBottom = window.scrollY + window.innerHeight;
      const listTopAbs = rect.top + window.scrollY;
      const rawPx = viewportBottom - (listTopAbs + start);
      const px = Math.round(clamp(rawPx, 0, h));
      list.style.setProperty('--progress-px', px + 'px');

      // Toggle 'passed' on items whose marker is within progress height
      if (!markers.length) recomputeMarkers();
      if (!prefersReduced && markers.length) {
        const slack = 6; // tiny buffer
        for (const m of markers) {
          if (m.y <= px + slack) m.el.classList.add('passed');
          else m.el.classList.remove('passed');
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      (prefersReduced ? compute : requestAnimationFrame.bind(window))(compute);
      // if prefersReduced, compute synchronously; otherwise via rAF
      requestAnimationFrame(() => { ticking = false; });
    };

    // Initialize and bind listeners
    recomputeMarkers();
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { recomputeMarkers(); compute(); });
  }

  async function init() {
    // Ensure data-driven rendering completes before wiring observers
    try {
      await renderFromData();
    } catch (_) { /* ignore */ }
    revealInitialVisible();
    setupObserver();
    setupProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); });
  } else {
    init();
  }
})();
