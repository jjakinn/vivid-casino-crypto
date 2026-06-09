// Stub API calls for chanced.com mirror + game grid injection
(function() {
  const CDN = "https://d3ta80o5sbquaz.cloudfront.net";

  // Working game IDs across providers
  const GAMES = [
    // Pragmatic Play
    { title: "Gates of Olympus", provider: "pragmatic", id: "vs20olympgate" },
    { title: "Sweet Bonanza", provider: "pragmatic", id: "vs20fruitsw" },
    { title: "Big Bass Bonanza", provider: "pragmatic", id: "vs10txbigbass" },
    { title: "Sugar Rush", provider: "pragmatic", id: "vs20sugarrush" },
    { title: "Wolf Gold", provider: "pragmatic", id: "vs25wolfgold" },
    { title: "Joker's Jewels", provider: "pragmatic", id: "vs5joker" },
    { title: "Egyptian Dreams", provider: "pragmatic", id: "vs25scarabqueen" },
    { title: "The Dog House", provider: "pragmatic", id: "vs20doghouse" },
    { title: "Aztec King", provider: "pragmatic", id: "vs25aztecking" },
    { title: "The Hand of Midas", provider: "pragmatic", id: "vs20midas" },
    // Evolution
    { title: "Dream Catcher", provider: "evolution", id: "dreamcatcher" },
    { title: "Mega Ball", provider: "evolution", id: "megaball" },
    { title: "Speed Roulette", provider: "evolution", id: "speedroulette" },
    { title: "Sic Bo", provider: "evolution", id: "sicbo" },
    { title: "Craps", provider: "evolution", id: "craps" },
  ];

  // Mock API data
  const PRAGMATIC_GAMES = GAMES.slice(0, 10).map((g, i) => ({
    id: i + 1, title: g.title, identifier: g.id, software: g.provider,
    provider: g.provider, provider_name: g.provider === "pragmatic" ? "Pragmatic Play" : "Evolution",
    has_jackpot: false, provider_id: 1, updated_at: "2024-01-01T00:00:00.000Z"
  }));

  const MOCK_ACTIVE_CATEGORIES = {
    result: {
      categories: [
        { id: 1, name: "Slots", slug: "slots", type: "category", show_in_home: true, show_in_menu: true, api_slug: "slots", data: { hide_pills: false, hide_sort_by: false }, games: PRAGMATIC_GAMES.slice(0, 6) },
        { id: 2, name: "Featured", slug: "featured", type: "category", show_in_home: true, show_in_menu: true, api_slug: "featured", data: { hide_pills: false, hide_sort_by: false }, games: PRAGMATIC_GAMES.slice(2, 8) },
        { id: 3, name: "New Releases", slug: "new-releases", type: "category", show_in_home: true, show_in_menu: true, api_slug: "new-releases", data: { hide_pills: false, hide_sort_by: false }, games: PRAGMATIC_GAMES.slice(4, 10) }
      ],
      providers: [{ id: 1, name: "Pragmatic Play", count: 10, banned_states: [] }],
      promo_race: null
    }
  };

  const MOCK_MAIN_BANNER = {
    result: {
      categories: [{ id: 1, title: "Welcome Bonus", slug: "welcome", image: "images/home/vegasmatt-main.webp", url: "/", open_in_new_tab: false }]
    }
  };

  const MOCK_ALL_GAMES = {
    results: { data: PRAGMATIC_GAMES, current_page: 1, last_page: 1, per_page: 20, total: PRAGMATIC_GAMES.length },
    providers: [{ id: 1, name: "Pragmatic Play", count: 10, banned_states: [] }]
  };

  const MOCK_USER = { id: 1, username: "guest", balance: 0, game_mode: "SC", jackpot_amount: null, can_bypass_geofencing: false };
  const MOCK_SITE_CONFIG = {};

  function getMockResponse(url) {
    if (url.includes('/active-categories')) return JSON.stringify(MOCK_ACTIVE_CATEGORIES);
    if (url.includes('/main-banner')) return JSON.stringify(MOCK_MAIN_BANNER);
    if (url.includes('/all/games') || url.includes('/slots') || url.includes('/featured') || url.includes('/new-releases')) return JSON.stringify(MOCK_ALL_GAMES);
    if (url.includes('/site-config')) return JSON.stringify(MOCK_SITE_CONFIG);
    if (url.includes('/user') && !url.includes('/users/')) return JSON.stringify(MOCK_USER);
    return '{}';
  }

  // Stub fetch
  const _fetch = window.fetch;
  window.fetch = function(url, opts) {
    const u = url.toString();
    if (u.includes('api.chanced.com') || u.includes('tracking.chanced.com') || u.includes('intercom.io') || u.includes('pusher.com')) {
      console.log('[STUB] fetch:', u);
      return Promise.resolve(new Response(getMockResponse(u), {status: 200, headers: {'content-type': 'application/json'}}));
    }
    return _fetch.apply(this, arguments);
  };

  // Stub XMLHttpRequest
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url) {
    this._stubbed = url.includes('api.chanced.com') || url.includes('tracking.chanced.com') || url.includes('intercom.io');
    this._stubUrl = url;
    return _open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(body) {
    if (this._stubbed) {
      console.log('[STUB] XHR:', this._stubUrl);
      const self = this;
      const response = getMockResponse(this._stubUrl);
      setTimeout(function() {
        self.readyState = 4;
        self.status = 200;
        self.responseText = response;
        self.response = response;
        if (self.onreadystatechange) self.onreadystatechange();
        if (self.onload) self.onload();
      }, 0);
      return;
    }
    return _send.apply(this, arguments);
  };

  // Stub WebSocket
  const _WebSocket = window.WebSocket;
  window.WebSocket = function(url) {
    console.log('[STUB] WebSocket:', url);
    const fake = { send: function(){}, close: function(){}, onopen: null, onmessage: null, onclose: null, onerror: null, readyState: 1 };
    setTimeout(function() { if (fake.onopen) fake.onopen({}); }, 0);
    return fake;
  };
  window.WebSocket.CONNECTING = 0; window.WebSocket.OPEN = 1; window.WebSocket.CLOSING = 2; window.WebSocket.CLOSED = 3;

  // ===== GAME GRID INJECTION =====
  function getImageUrl(game) {
    return `${CDN}/${game.provider}/${game.id}.webp`;
  }

  function createGameTile(game) {
    const tile = document.createElement('div');
    tile.style.cssText = 'position:relative;border-radius:8px;overflow:hidden;cursor:pointer;transition:transform 0.2s;aspect-ratio:0.71;background:#1a1a2e;flex:0 0 auto;width:180px;';
    tile.onmouseenter = () => tile.style.transform = 'scale(1.05)';
    tile.onmouseleave = () => tile.style.transform = 'scale(1)';

    const img = document.createElement('img');
    img.src = getImageUrl(game);
    img.alt = game.title;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror = function() {
      this.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#222;color:#aaa;font-size:12px;text-align:center;padding:8px;';
      fallback.textContent = game.title;
      tile.appendChild(fallback);
    };

    const label = document.createElement('div');
    label.textContent = game.title;
    label.style.cssText = 'position:absolute;bottom:0;left:0;right:0;padding:8px 12px;background:rgba(0,0,0,0.7);color:#fff;font-size:12px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

    tile.appendChild(img);
    tile.appendChild(label);
    return tile;
  }

  function injectGameGrid() {
    // Find the game section - look for "Over 1,000 Games" heading
    const headings = document.querySelectorAll('h2');
    let targetSection = null;
    for (const h of headings) {
      if (h.textContent.includes('Games') || h.textContent.includes('Favorite')) {
        targetSection = h.closest('div[class*="bg-"]') || h.closest('div') || h.parentElement;
        break;
      }
    }

    if (!targetSection) {
      console.log('[GAME GRID] Could not find target section');
      return;
    }

    // Remove loading elements
    const allDivs = targetSection.querySelectorAll('div');
    for (const div of allDivs) {
      if (div.textContent.includes('Loading') && div.children.length < 3) {
        div.style.display = 'none';
      }
    }

    // Create scrollable container
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;gap:16px;overflow-x:auto;padding:20px 0;scroll-snap-type:x mandatory;';

    GAMES.forEach(game => {
      const tile = createGameTile(game);
      tile.style.scrollSnapAlign = 'start';
      container.appendChild(tile);
    });

    targetSection.appendChild(container);
    console.log('[GAME GRID] Injected', GAMES.length, 'games');
  }

  // Run injection after a short delay
  setTimeout(injectGameGrid, 1500);
  // Also try again in case Vue re-renders
  setTimeout(injectGameGrid, 4000);
})();
