#!/bin/bash
cd /Users/Jakin/vivid-casino

# For 404.html: replace lines 411-537 with new static fallback
head -n 410 404.html > 404.html.new
cat >> 404.html.new << 'SCRIPTBLOCK'
    <!-- Static Fallback Overlay -->
    <script>
    (function() {
      function showFallback() {
        // Hide Vue's broken app
        var app = document.getElementById('app');
        if (app) app.style.display = 'none';

        // Remove any existing fallback
        var existing = document.getElementById('static-fallback');
        if (existing) existing.remove();

        // Create fixed overlay covering entire viewport
        var fallback = document.createElement('div');
        fallback.id = 'static-fallback';
        fallback.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;overflow-y:auto;z-index:999999;background:#0a0a1a;color:#fff;font-family:system-ui,-apple-system,sans-serif;';
        fallback.innerHTML = '<div style="display:flex;flex-direction:column;min-height:100%;">' +
          // Header
          '<header style="position:sticky;top:0;z-index:99999;background:#0a0a1a;border-bottom:1px solid #1a1a2e;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;max-width:1400px;margin:0 auto;padding:12px 24px;">' +
              '<a href="/vivid-casino/" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:#fff;">' +
                '<img src="/vivid-casino/images/favicon/chanced-icon-192.png" alt="Chanced" style="width:36px;height:36px;border-radius:6px;display:block;">' +
                '<span style="font-size:20px;font-weight:800;letter-spacing:-0.5px;">CHANCED</span>' +
              '</a>' +
              '<nav style="display:flex;align-items:center;gap:24px;">' +
                '<a href="#faq" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500;">FAQ</a>' +
                '<a href="https://chanced.com/docs/Terms-And-Conditions.pdf" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500;">Terms</a>' +
                '<a href="https://www.chanced.com/privacy-policy" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500;">Privacy</a>' +
              '</nav>' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<button style="background:transparent;border:1px solid #4b5563;color:#fff;padding:8px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Log in</button>' +
                '<button style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;color:#fff;padding:8px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;">' +
                  'Sign up <span style="font-size:16px;">→</span>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</header>' +
          // Hero
          '<section style="background:#0a0a1a;padding:60px 24px;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:40px;max-width:1400px;margin:0 auto;">' +
              '<div style="flex:1;max-width:600px;">' +
                '<h1 style="color:#fff;font-size:42px;font-weight:800;line-height:1.1;margin:0 0 20px;">Get Extra Coins + 100 Free Spins</h1>' +
                '<button style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;color:#fff;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;margin-bottom:30px;">Claim Welcome Offer</button>' +
                '<div style="display:flex;align-items:center;gap:16px;color:#9ca3af;font-size:14px;">' +
                  '<span>⭐ #1 Social Casino</span>' +
                  '<span>🎰 No Purchase Necessary</span>' +
                '</div>' +
              '</div>' +
              '<div style="flex:1;display:flex;justify-content:flex-end;max-width:500px;">' +
                '<img src="/vivid-casino/images/home/vegasmatt-main.webp" alt="Welcome Bonus" style="width:100%;max-width:400px;border-radius:16px;box-shadow:0 20px 60px rgba(99,102,241,0.3);display:block;">' +
              '</div>' +
            '</div>' +
          '</section>' +
          // Game section for carousel
          '<div class="bg-fallback" style="background:#0a0a1a;padding:20px 0;">' +
            '<h2 style="color:#fff;font-size:28px;font-weight:700;text-align:center;margin:0 0 20px;">Over 1,000 Games - Find Your Favorite!</h2>' +
          '</div>' +
          // Footer
          '<footer style="background:#0a0a1a;border-top:1px solid #1a1a2e;padding:48px 24px;margin-top:auto;">' +
            '<div style="max-width:1400px;margin:0 auto;">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;">' +
                '<a href="/vivid-casino/" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:#fff;">' +
                  '<img src="/vivid-casino/images/favicon/chanced-icon-192.png" alt="Chanced" style="width:36px;height:36px;border-radius:6px;display:block;">' +
                  '<span style="font-size:20px;font-weight:800;">CHANCED</span>' +
                '</a>' +
              '</div>' +
              '<p style="color:#9ca3af;font-size:14px;line-height:1.6;max-width:700px;margin-bottom:32px;">' +
                'Chanced is the #1 Social Casino offering the best online slots, table games, and live dealer experiences. Play with Gold Coins for fun or Sweeps Coins for a chance to win real prizes.' +
              '</p>' +
              '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px;font-size:14px;">' +
                '<div><h3 style="color:#fff;font-weight:600;margin-bottom:12px;">Games</h3><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;"><li><a href="#" style="color:#9ca3af;text-decoration:none;">Slots</a></li><li><a href="#" style="color:#9ca3af;text-decoration:none;">Table Games</a></li><li><a href="#" style="color:#9ca3af;text-decoration:none;">Live Casino</a></li></ul></div>' +
                '<div><h3 style="color:#fff;font-weight:600;margin-bottom:12px;">Support</h3><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;"><li><a href="#faq" style="color:#9ca3af;text-decoration:none;">FAQ</a></li><li><a href="#" style="color:#9ca3af;text-decoration:none;">Contact Us</a></li></ul></div>' +
                '<div><h3 style="color:#fff;font-weight:600;margin-bottom:12px;">Legal</h3><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;"><li><a href="#" style="color:#9ca3af;text-decoration:none;">Terms of Service</a></li><li><a href="#" style="color:#9ca3af;text-decoration:none;">Privacy Policy</a></li></ul></div>' +
                '<div><h3 style="color:#fff;font-weight:600;margin-bottom:12px;">Social</h3><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;"><li><a href="#" style="color:#9ca3af;text-decoration:none;">Twitter</a></li><li><a href="#" style="color:#9ca3af;text-decoration:none;">Discord</a></li></ul></div>' +
              '</div>' +
              '<div style="margin-top:32px;padding-top:24px;border-top:1px solid #1a1a2e;color:#9ca3af;font-size:12px;">' +
                '© 2025 Chanced Social Casino. All rights reserved. Play responsibly.' +
              '</div>' +
            '</div>' +
          '</footer>' +
        '</div>';

        document.body.appendChild(fallback);
      }

      // Run immediately when DOM is ready, no detection needed
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(showFallback, 800); });
      } else {
        setTimeout(showFallback, 800);
      }
    })();
    </script>
SCRIPTBLOCK

tail -n +538 404.html >> 404.html.new
mv 404.html.new 404.html
echo "404.html updated"
