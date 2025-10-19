// podcast-demo.js - small demo that fetches data from the public podcast API you used
(function () {
  const API_URL = "https://podcast-api.netlify.app/";

  async function fetchPodcasts() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch podcasts');
      return await res.json();
    } catch (err) {
      console.warn('Podcast fetch failed:', err);
      return null;
    }
  }

  async function mount(rootSelector) {
    const root = (typeof rootSelector === 'string') ? document.querySelector(rootSelector) : rootSelector;
    if (!root) return;
    root.innerHTML = '<p>Loading podcasts…</p>';

    const data = await fetchPodcasts();
    if (!data || !data.podcasts) {
      root.innerHTML = '<p>Could not load podcasts (CORS or API issue). Check console for details.</p>';
      return;
    }

    const list = document.createElement('div');
    list.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px"></div>';
    const container = list.firstElementChild;

    // show first 8 podcasts
    const shows = data.podcasts.slice(0, 8);
    shows.forEach(p => {
      const item = document.createElement('div');
      item.style.padding = '8px';
      item.style.borderRadius = '8px';
      item.style.background = 'rgba(255,255,255,0.02)';
      item.innerHTML = `<strong>${p.title}</strong><div style="font-size:.9rem;color:rgba(255,255,255,0.7)">${p.description ? (p.description.slice(0,140)+'…') : ''}</div>
        <a style="display:inline-block;margin-top:6px" href="${p.listennotes_url || '#'}" target="_blank" rel="noopener">View</a>`;
      container.appendChild(item);
    });

    root.innerHTML = '';
    root.appendChild(list);
  }

  window.startPodcastDemo = function (selector) {
    setTimeout(() => mount(selector), 60);
  };
})();
