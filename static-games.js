// Static game grid - renders game tiles with real CDN images
(function() {
  const CDN = 'https://d3ta80o5sbquaz.cloudfront.net/images';
  
  const GAMES = [
    // Pragmatic Play
    { title: 'Gates of Olympus', provider: 'pragmatic', id: 'vs20olympgate' },
    { title: 'Sweet Bonanza', provider: 'pragmatic', id: 'vs20fruitsw' },
    { title: 'Big Bass Bonanza', provider: 'pragmatic', id: 'vs10txbigbass' },
    { title: 'Sugar Rush', provider: 'pragmatic', id: 'vs20sugarrush' },
    { title: 'Wolf Gold', provider: 'pragmatic', id: 'vs25wolfgold' },
    { title: 'Joker\'s Jewels', provider: 'pragmatic', id: 'vs5joker' },
    { title: 'Egyptian Dreams', provider: 'pragmatic', id: 'vs25scarabqueen' },
    { title: 'The Dog House', provider: 'pragmatic', id: 'vs20doghouse' },
    { title: 'Aztec King', provider: 'pragmatic', id: 'vs25aztecking' },
    { title: 'The Hand of Midas', provider: 'pragmatic', id: 'vs20midas' },
    // Evolution
    { title: 'Dream Catcher', provider: 'evolution', id: 'dreamcatcher' },
    { title: 'Mega Ball', provider: 'evolution', id: 'megaball' },
    { title: 'Speed Roulette', provider: 'evolution', id: 'speedroulette' },
    { title: 'Sic Bo', provider: 'evolution', id: 'sicbo' },
    { title: 'Craps', provider: 'evolution', id: 'craps' },
  ];
  
  function getImageUrl(game) {
    return `${CDN}/${game.provider}/${game.id}.webp`;
  }
  
  function createGameGrid() {
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
    grid.style.gap = '16px';
    grid.style.padding = '20px';
    
    GAMES.forEach(game => {
      const tile = document.createElement('div');
      tile.style.position = 'relative';
      tile.style.borderRadius = '8px';
      tile.style.overflow = 'hidden';
      tile.style.cursor = 'pointer';
      tile.style.transition = 'transform 0.2s';
      tile.style.aspectRatio = '0.71';
      tile.style.background = '#1a1a2e';
      
      const img = document.createElement('img');
      img.src = getImageUrl(game);
      img.alt = game.title;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.onerror = function() {
        this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="140"><rect fill="%23222" width="100" height="140"/><text fill="%23aaa" x="50" y="70" text-anchor="middle">' + game.title + '</text></svg>';
      };
      
      const label = document.createElement('div');
      label.textContent = game.title;
      label.style.position = 'absolute';
      label.style.bottom = '0';
      label.style.left = '0';
      label.style.right = '0';
      label.style.padding = '8px 12px';
      label.style.background = 'rgba(0,0,0,0.7)';
      label.style.color = '#fff';
      label.style.fontSize = '12px';
      label.style.fontWeight = 'bold';
      label.style.whiteSpace = 'nowrap';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';
      
      tile.appendChild(img);
      tile.appendChild(label);
      grid.appendChild(tile);
    });
    
    return grid;
  }
  
  // Replace loading sections with game grid
  function injectGames() {
    const sections = document.querySelectorAll('div[class*="game"]');
    const loadingTexts = document.querySelectorAll('p:contains("Loading")');
    
    // Find elements with "Loading" text
    const allElements = document.querySelectorAll('*');
    let replaced = 0;
    
    for (const el of allElements) {
      if (el.textContent === 'Loading' && el.tagName === 'P') {
        const parent = el.parentElement;
        if (parent && parent.children.length <= 3) {
          parent.innerHTML = '';
          parent.appendChild(createGameGrid());
          replaced++;
          if (replaced >= 2) break;
        }
      }
    }
    
    if (replaced === 0) {
      // Fallback: find section with "Over 1,000 Games" heading
      const headings = document.querySelectorAll('h2');
      for (const h of headings) {
        if (h.textContent.includes('Games')) {
          const section = h.parentElement;
          if (section) {
            const nextDiv = section.querySelector('div');
            if (nextDiv) {
              nextDiv.innerHTML = '';
              nextDiv.appendChild(createGameGrid());
              break;
            }
          }
        }
      }
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectGames);
  } else {
    setTimeout(injectGames, 1000);
  }
})();
