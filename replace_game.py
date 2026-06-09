#!/usr/bin/env python3
import re

with open('lobby.html', 'r') as f:
    content = f.read()

# Find the Popular Games section and replace the Mr Oinksters entry with Snoop Dog Dollars
# The entry we want to replace is data-key="9" in the Popular Games section

old_entry = '''<div class="slider-tile relative" data-key="9"><a class="transition duration-200 ease-in-out hover:opacity-80 delay-0 hover:rotate-1 hover:scale-105 block" href="/hub88/casino/games/mroinksterschancedholdandwin"><!-- --><!-- --><!-- --><div class="relative"><div style="width: 157.667px; height: 220.822px; display: none; align-items: center; justify-content: center; border-radius: 4px;">

</div><img alt="Game Tile" class="flex flex-col items-center transition duration-150 ease-in-out rounded-md shadow-md delay-0" data-fallback="https://d3ta80o5sbquaz.cloudfront.net/images/default.webp" height="220.822" src="https://d3ta80o5sbquaz.cloudfront.net/images/hub88/mroinksterschancedholdandwin.webp?1779851387000" style="width: 157.667px; height: 220.822px;" width="157.667"/></div></a></div>'''

new_entry = '''<div class="slider-tile relative" data-key="9"><a class="transition duration-200 ease-in-out hover:opacity-80 delay-0 hover:rotate-1 hover:scale-105 block" href="/softswiss/casino/games/softswiss-SnoopDoggDollars"><!-- --><!-- --><!-- --><div class="relative"><div style="width: 157.667px; height: 220.822px; display: none; align-items: center; justify-content: center; border-radius: 4px;">

</div><img alt="Game Tile" class="flex flex-col items-center transition duration-150 ease-in-out rounded-md shadow-md delay-0" data-fallback="https://cdn.softswiss.net/i/s4/softswiss/SnoopDoggDollars.png" height="220.822" src="https://d3ta80o5sbquaz.cloudfront.net/images/softswiss/SnoopDoggDollars.webp?1774481742000" style="width: 157.667px; height: 220.822px;" width="157.667"/></div></a></div>'''

if old_entry in content:
    content = content.replace(old_entry, new_entry, 1)
    print("Replaced Mr Oinksters with Snoop Dog Dollars in Popular Games section")
else:
    print("ERROR: Could not find the exact entry to replace")
    exit(1)

with open('lobby.html', 'w') as f:
    f.write(content)

print("Done!")
