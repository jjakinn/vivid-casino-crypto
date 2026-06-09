#!/usr/bin/env python3
import re

with open('lobby.html', 'r') as f:
    content = f.read()

# Old: Huff House Bonanza by Iconic 21 (data-key="16" in Popular Games)
old_entry = '''<div class="slider-tile relative" data-key="16"><a class="transition duration-200 ease-in-out hover:opacity-80 delay-0 hover:rotate-1 hover:scale-105 block" href="/casino/games/beterlive-launch_slots_huff_house_bonanza"><!-- --><!-- --><!-- --><div class="relative"><div style="width: 157.667px; height: 220.822px; display: none; align-items: center; justify-content: center; border-radius: 4px;">

</div><img alt="Game Tile" class="flex flex-col items-center transition duration-150 ease-in-out rounded-md shadow-md delay-0" data-fallback="https://d3ta80o5sbquaz.cloudfront.net/images/default.webp" height="220.822" src="https://d3ta80o5sbquaz.cloudfront.net/images/relax/launch_slots_huff_house_bonanza.webp?1779306231000" style="width: 157.667px; height: 220.822px;" width="157.667"/></div></a></div>'''

# New: Duck Hunter's Happy Hour by No Limit City (evolution provider)
new_entry = '''<div class="slider-tile relative" data-key="16"><a class="transition duration-200 ease-in-out hover:opacity-80 delay-0 hover:rotate-1 hover:scale-105 block" href="/evolution/casino/games/duckhunteppyhour"><!-- --><!-- --><!-- --><div class="relative"><div style="width: 157.667px; height: 220.822px; display: none; align-items: center; justify-content: center; border-radius: 4px;">

</div><img alt="Game Tile" class="flex flex-col items-center transition duration-150 ease-in-out rounded-md shadow-md delay-0" data-fallback="https://d3ta80o5sbquaz.cloudfront.net/images/default.webp" height="220.822" src="https://d3ta80o5sbquaz.cloudfront.net/images/evolution/duckhunteppyhour.webp?1779302874000" style="width: 157.667px; height: 220.822px;" width="157.667"/></div></a></div>'''

if old_entry in content:
    content = content.replace(old_entry, new_entry, 1)
    print("Replaced Huff House Bonanza with Duck Hunter's Happy Hour in Popular Games")
else:
    print("ERROR: Could not find exact entry")
    exit(1)

with open('lobby.html', 'w') as f:
    f.write(content)

print("Done!")
