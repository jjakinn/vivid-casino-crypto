import re
import json

with open('lobby.html', 'r') as f:
    html = f.read()

results = []
seen_categories = set()

# Only process sections with id="home_category_slider" - these are in the main content, not sidebar
pos = 0
while True:
    idx = html.find('id="home_category_slider"', pos)
    if idx == -1:
        break
    
    # Extract the header section (500 chars after id)
    header = html[idx:idx+500]
    
    # Get category from href (links have been replaced to view-all.html?category=...)
    href_match = re.search(r'href="view-all\.html\?category=([^"]+)"', header)
    if not href_match:
        pos = idx + 1
        continue
    
    category = href_match.group(1)
    if category in seen_categories:
        pos = idx + 1
        continue
    seen_categories.add(category)
    
    # Get name from <p class="font-medium...">
    name_match = re.search(r'<p class="font-medium[^"]*"[^>]*>([^<]+)</p>', header)
    name = name_match.group(1).strip() if name_match else category
    
    # Get icon from <img alt="Default Category"...>
    icon_match = re.search(r'<img[^>]*alt="Default Category"[^>]*src="([^"]+)"', header)
    if not icon_match:
        icon_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*alt="Default Category"', header)
    icon = icon_match.group(1) if icon_match else ''
    
    # Find the slider that follows this header
    slider_idx = html.find('class="py-2 overflow-x-scroll no-scrollbar home-casino-slider"', idx)
    if slider_idx == -1 or slider_idx > idx + 2000:
        pos = idx + 1
        continue
    
    # Find the end of this slider - next home_category_slider or footer section
    next_cat = html.find('id="home_category_slider"', slider_idx + 1)
    next_footer = html.find('class="py-6 flex', slider_idx)
    next_providers = html.find('>Providers</p>', slider_idx)
    
    candidates = [c for c in [next_cat, next_footer, next_providers] if c != -1]
    slider_end = min(candidates) if candidates else slider_idx + 5000
    
    slider_html = html[slider_idx:slider_end]
    
    # Extract games from this slider (skip see-all-button tiles)
    games = []
    for tile_match in re.finditer(
        r'<div class="slider-tile relative"[^>]*>.*?<a[^>]*href="([^"]+)"[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*>',
        slider_html, re.DOTALL
    ):
        href = tile_match.group(1)
        img = tile_match.group(2)
        # Skip "see all" tiles (they link to view-all.html)
        if 'view-all.html' in href:
            continue
        games.append({'href': href, 'img': img})
    
    if games:
        results.append({
            'category': category,
            'name': name,
            'icon': icon,
            'games': games
        })
    
    pos = idx + 1

# Extract providers section (it's not in home_category_slider, handle separately)
providers_idx = html.find('>Providers</p>')
if providers_idx != -1:
    # Find slider after providers header
    slider_idx = html.find('class="py-2 overflow-x-scroll no-scrollbar home-casino-slider"', providers_idx)
    if slider_idx != -1:
        next_section = html.find('class="py-6 flex', slider_idx)
        if next_section == -1:
            next_section = html.find('class="py-2 max-w-[100%]"', slider_idx + 100)
        slider_end = next_section if next_section != -1 else slider_idx + 10000
        
        slider_html = html[slider_idx:slider_end]
        providers = []
        for prov_match in re.finditer(r'<img[^>]*src="([^"]*providers/logo/[^"]+)"[^>]*>', slider_html):
            providers.append(prov_match.group(1))
        
        if providers and 'providers' not in seen_categories:
            results.append({
                'category': 'providers',
                'name': 'Providers',
                'icon': 'https://d3ta80o5sbquaz.cloudfront.net/categories/featured.webp',
                'providers': providers
            })

print(f"Found {len(results)} categories:")
for r in results:
    if 'games' in r:
        print(f"  {r['category']}: {r['name']} - {len(r['games'])} games")
    else:
        print(f"  {r['category']}: {r['name']} - {len(r['providers'])} providers")

with open('view-all-games.js', 'w') as f:
    f.write('var CATEGORY_DATA = ')
    f.write(json.dumps(results, indent=2))
    f.write(';\n')

print(f"\nWrote data to view-all-games.js")
