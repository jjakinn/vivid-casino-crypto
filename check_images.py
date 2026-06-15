import os
import re

# All image files that exist
existing = set()
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.lower().endswith(('.webp','.png','.jpg','.jpeg','.svg','.avif','.gif')):
            path = os.path.join(root, f).lstrip('./')
            existing.add('/' + path)
            existing.add(path)

# Find all image references in HTML/JS/CSS
refs = set()
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith(('.html','.js','.css')):
            with open(os.path.join(root, f), 'r', errors='ignore') as fp:
                content = fp.read()
                # src="..." href="..." content="..."
                for match in re.finditer(r'(?:src|href|content)=["\']([^"\']*\.(?:webp|png|jpg|jpeg|svg|avif|gif))["\']', content, re.I):
                    refs.add(match.group(1))
                # url(...)
                for match in re.finditer(r'url\(["\']?([^"\')]*\.(?:webp|png|jpg|jpeg|svg|avif|gif))[^"\']*\)', content, re.I):
                    refs.add(match.group(1))

# Categorize
local_missing = []
external = []
for ref in sorted(refs):
    if ref.startswith('http'):
        external.append(ref)
    elif ref.startswith('data:'):
        pass
    else:
        # Normalize path
        norm = ref
        if not norm.startswith('/'):
            norm = '/' + norm
        if norm not in existing and ref not in existing:
            local_missing.append(ref)

print("=== LOCAL REFERENCES MISSING ===")
for m in local_missing:
    print(m)

print(f"\n=== EXTERNAL REFERENCES ({len(external)}) ===")
for e in external:
    print(e)
