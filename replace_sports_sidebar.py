import re
import sys

# Read the new sidebar content
with open('sports-sidebar-new.html', 'r') as f:
    new_sidebar = f.read().strip()

files = ['view-all.html', 'game.html', 'lobby.html']

for filename in files:
    try:
        with open(filename, 'r') as f:
            content = f.read()
        
        # Find and replace the sidebar-sports-content div
        # Pattern: <div id="sidebar-sports-content" ... > ... </div> followed by </div></div><div id="mobile-sidebar-backdrop"
        # or more specifically, the div that starts with sidebar-sports-content and ends before the mobile-sidebar-backdrop
        
        pattern = r'(<div id="sidebar-sports-content"[^>]*>)(.*?)(</div>\s*</div>\s*</div>\s*<div id="mobile-sidebar-backdrop")'
        
        # But we need to match the specific closing tags. Let's use a more careful approach.
        # Find the start of sidebar-sports-content div
        start_idx = content.find('<div id="sidebar-sports-content"')
        if start_idx == -1:
            print(f"[SKIP] {filename}: sidebar-sports-content not found")
            continue
        
        # Find the end of this div - we need to find the matching </div> for the sidebar-sports-content div
        # Since it contains nested divs, we'll find the div that ends right before mobile-sidebar-backdrop
        end_marker = '<div id="mobile-sidebar-backdrop"'
        end_idx = content.find(end_marker, start_idx)
        
        if end_idx == -1:
            # Try another approach - look for the closing </div> before </div></div><div id="mobile-sidebar-backdrop"
            # Actually, let's look for the pattern: </div> </div> </div> <div id="mobile-sidebar-backdrop"
            # Search from end of file backwards for the pattern
            mobile_idx = content.rfind(end_marker)
            if mobile_idx == -1:
                print(f"[SKIP] {filename}: mobile-sidebar-backdrop not found")
                continue
            # The sidebar-sports-content should end just before the parent </div></div> 
            # Let's work backwards from mobile_idx to find the right boundary
            # We need to find the </div> that closes sidebar-sports-content
            # The structure is: </div></div></div><div id="mobile-sidebar-backdrop"
            # Where the last </div> closes sidebar-sports-content, </div> closes sidebar-desktop, </div> closes sidebar-parent
            
            # Let's look for the div that starts at start_idx and match it properly
            div_start = content.find('>', start_idx) + 1
            
            # Find the closing </div> by counting divs
            depth = 1
            pos = div_start
            while depth > 0 and pos < len(content):
                next_open = content.find('<div', pos)
                next_close = content.find('</div>', pos)
                
                if next_close == -1:
                    break
                if next_open != -1 and next_open < next_close:
                    depth += 1
                    pos = next_open + 4
                else:
                    depth -= 1
                    pos = next_close + 6
            
            if depth != 0:
                print(f"[SKIP] {filename}: Could not match divs properly")
                continue
            
            # pos is now the position after the closing </div> of sidebar-sports-content
            # The new content should replace from start_idx to pos
            new_content = content[:start_idx] + new_sidebar + content[pos:]
        else:
            # Find the </div> right before the mobile-sidebar-backdrop
            # Walk back to find the matching </div>
            pos = end_idx
            # Skip whitespace
            while pos > 0 and content[pos-1] in ' \t\n\r':
                pos -= 1
            # Should be at </div>
            if content[pos-6:pos] != '</div>':
                # Try to find the previous </div> 
                # The structure is: ... </div> </div> </div> <div id="mobile-sidebar-backdrop"
                # We need to find the last </div> before the closing ones
                # Let's count divs properly
                div_start = content.find('>', start_idx) + 1
                depth = 1
                pos = div_start
                while depth > 0 and pos < len(content):
                    next_open = content.find('<div', pos)
                    next_close = content.find('</div>', pos)
                    
                    if next_close == -1:
                        break
                    if next_open != -1 and next_open < next_close:
                        depth += 1
                        pos = next_open + 4
                    else:
                        depth -= 1
                        pos = next_close + 6
                
                if depth != 0:
                    print(f"[SKIP] {filename}: Could not match divs")
                    continue
                
                new_content = content[:start_idx] + new_sidebar + content[pos:]
            else:
                pos = pos - 6
                # But we need to go back more if there are closing divs for other containers
                # Actually, let's just use the div counting approach which is more reliable
                div_start = content.find('>', start_idx) + 1
                depth = 1
                pos = div_start
                while depth > 0 and pos < len(content):
                    next_open = content.find('<div', pos)
                    next_close = content.find('</div>', pos)
                    
                    if next_close == -1:
                        break
                    if next_open != -1 and next_open < next_close:
                        depth += 1
                        pos = next_open + 4
                    else:
                        depth -= 1
                        pos = next_close + 6
                
                new_content = content[:start_idx] + new_sidebar + content[pos:]
        
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"[OK] {filename}: Replaced sidebar-sports-content")
        
    except Exception as e:
        print(f"[ERR] {filename}: {e}")

