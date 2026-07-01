/**
 * Geo-Restriction Modal - Simplified & Robust
 * 
 * Detects user location via IP geolocation and shows VPN recommendations
 * for restricted regions. Includes bypass option for users with VPNs.
 */

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    const urlParams = new URLSearchParams(window.location.search);
    const DEMO_MODE = urlParams.get('geo_demo') === '1';
    const ALLOW_OVERRIDE = urlParams.get('geo_allow') === '1';
    
    // Check localStorage for persistent bypass
    const BYPASS_KEY = 'vivid_geo_bypass';
    const hasBypass = localStorage.getItem(BYPASS_KEY) === '1';
    
    // Countries where games are BLOCKED (show modal)
    const BLOCKED_COUNTRIES = [
        "US", "GB", "AU", "CA", "FR", "DE", "IT", "ES", "NL", "BE",
        "DK", "SE", "NO", "FI", "AT", "CH", "IE", "PT", "GR", "PL",
        "CZ", "HU", "SK", "SI", "HR", "RO", "BG", "LT", "LV", "EE",
        "LU", "MT", "CY"
    ];
    
    // Countries where games are ALLOWED (no modal)
    const ALLOWED_COUNTRIES = [
        "CL", "BO", "AR", "BR", "MX", "CO", "PE", "EC", "UY", "PY",
        "VE", "PA", "CR", "GT", "HN", "SV", "NI", "BZ", "JM", "TT",
        "BB", "BS", "DO", "CU", "PR"
    ];

    // ============ STATE ============
    let userCountry = null;
    let isRestricted = null;
    let modalElement = null;
    let detectionPromise = null;

    // ============ DETECT USER LOCATION ============
    async function detectLocation() {
        // Return cached result
        if (isRestricted !== null) return isRestricted;
        
        // Return existing promise if detection is in flight
        if (detectionPromise) return detectionPromise;
        
        // URL override
        if (ALLOW_OVERRIDE) {
            console.log('[Geo] URL override: allowing');
            isRestricted = false;
            return false;
        }
        
        // localStorage bypass
        if (hasBypass) {
            console.log('[Geo] localStorage bypass: allowing');
            isRestricted = false;
            return false;
        }
        
        // Demo mode
        if (DEMO_MODE) {
            console.log('[Geo] Demo mode: blocking');
            isRestricted = true;
            return true;
        }
        
        // Start detection
        detectionPromise = doDetection();
        return detectionPromise;
    }
    
    async function doDetection() {
        try {
            console.log('[Geo] Detecting location...');
            
            // Use ipapi.co with no-cors fallback handling
            const response = await fetch('https://ipapi.co/json/', { 
                method: 'GET',
                cache: 'no-store',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            const data = await response.json();
            userCountry = (data.country_code || '').toUpperCase();
            
            console.log('[Geo] Detected country:', userCountry);
            
            if (!userCountry) {
                console.warn('[Geo] No country returned, allowing');
                isRestricted = false;
                return false;
            }
            
            // Check lists
            if (ALLOWED_COUNTRIES.includes(userCountry)) {
                console.log('[Geo] ALLOWED:', userCountry);
                isRestricted = false;
                return false;
            }
            
            if (BLOCKED_COUNTRIES.includes(userCountry)) {
                console.log('[Geo] BLOCKED:', userCountry);
                isRestricted = true;
                return true;
            }
            
            // Unknown country — allow (don't block legitimate users)
            console.log('[Geo] Unknown country, allowing:', userCountry);
            isRestricted = false;
            return false;
            
        } catch (err) {
            console.warn('[Geo] Detection failed:', err.message);
            console.warn('[Geo] Defaulting to ALLOW');
            isRestricted = false;
            return false;
        } finally {
            detectionPromise = null;
        }
    }

    // ============ MODAL ============
    function showGeoModal() {
        if (!modalElement) createModal();
        requestAnimationFrame(() => {
            modalElement.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function hideGeoModal() {
        if (modalElement) {
            modalElement.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function createModal() {
        const detectedCountry = userCountry || 'Unknown';
        const isBlocked = BLOCKED_COUNTRIES.includes(detectedCountry);
        
        const html = `
            <div class="geo-modal-backdrop" id="geoModalBackdrop">
                <div class="geo-modal-content">
                    <button class="geo-modal-close" id="geoModalClose" aria-label="Close">✕</button>
                    
                    <h2 class="geo-modal-title">🌍 Location Check</h2>
                    
                    <p class="geo-modal-message">
                        Detected location: <strong>${getFlagEmoji(detectedCountry)} ${detectedCountry}</strong><br>
                        ${isBlocked 
                            ? 'This region has gambling restrictions. Please use a VPN to an allowed country.' 
                            : 'Your location appears to be restricted.'}
                    </p>
                    
                    <div class="geo-info-box">
                        <strong>Allowed VPN locations:</strong><br>
                        🇨🇱 Chile · 🇧🇷 Brazil · 🇦🇷 Argentina · 🇲🇽 Mexico · 🇨🇴 Colombia
                    </div>
                    
                    <div class="geo-buttons">
                        <button class="geo-btn geo-btn-primary" id="geoModalBypass">
                            ✓ I Have a VPN — Let Me Through
                        </button>
                        <button class="geo-btn geo-btn-secondary" id="geoModalClose2">
                            Close
                        </button>
                    </div>
                    
                    <p class="geo-modal-footer">
                        <small>Press <kbd>Shift</kbd>+<kbd>G</kbd> to toggle bypass</small>
                    </p>
                </div>
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        modalElement = wrapper.firstElementChild;
        document.body.appendChild(modalElement);
        
        // Event listeners
        document.getElementById('geoModalClose').addEventListener('click', hideGeoModal);
        document.getElementById('geoModalClose2').addEventListener('click', hideGeoModal);
        document.getElementById('geoModalBackdrop').addEventListener('click', (e) => {
            if (e.target === modalElement) hideGeoModal();
        });
        document.getElementById('geoModalBypass').addEventListener('click', () => {
            localStorage.setItem(BYPASS_KEY, '1');
            console.log('[Geo] Bypass enabled in localStorage');
            hideGeoModal();
            isRestricted = false;
            // Reload to apply bypass
            window.location.reload();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalElement?.classList.contains('active')) {
                hideGeoModal();
            }
            // Shift+G bypass shortcut
            if (e.shiftKey && e.key === 'G') {
                e.preventDefault();
                localStorage.setItem(BYPASS_KEY, '1');
                console.log('[Geo] Bypass enabled via keyboard shortcut');
                hideGeoModal();
                isRestricted = false;
                window.location.reload();
            }
        });
        
        injectStyles();
    }

    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode === 'Unknown') return '🌐';
        try {
            const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
            return String.fromCodePoint(...codePoints);
        } catch {
            return '🌐';
        }
    }

    function injectStyles() {
        if (document.getElementById('geo-modal-styles')) return;
        
        const styles = `
            .geo-modal-backdrop {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                z-index: 999999; display: flex; align-items: center; justify-content: center;
                background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
                opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
            }
            .geo-modal-backdrop.active { opacity: 1; pointer-events: all; }
            .geo-modal-content {
                background: #1a1a2e; border: 1px solid #333;
                color: #fff; display: flex; flex-direction: column;
                margin: 16px; max-width: 420px; width: 100%;
                padding: 32px 24px 24px; position: relative; text-align: center;
                border-radius: 12px; transform: translateY(-20px);
                transition: transform 0.3s ease; gap: 16px;
            }
            .geo-modal-backdrop.active .geo-modal-content { transform: translateY(0); }
            .geo-modal-close {
                color: #888; cursor: pointer; position: absolute;
                top: 12px; right: 16px; background: none; border: none;
                font-size: 20px; padding: 0; width: 32px; height: 32px;
                display: flex; align-items: center; justify-content: center;
            }
            .geo-modal-close:hover { color: #fff; }
            .geo-modal-title { font-size: 22px; font-weight: 600; margin: 0; color: #fff; }
            .geo-modal-message { color: #ccc; font-size: 14px; line-height: 1.6; margin: 0; }
            .geo-modal-message strong { color: #fff; }
            .geo-info-box {
                background: rgba(255,255,255,0.05); border: 1px solid #333;
                border-radius: 8px; padding: 12px; font-size: 13px; color: #aaa;
            }
            .geo-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
            .geo-btn {
                padding: 12px 20px; border-radius: 8px; font-size: 14px;
                font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
                width: 100%;
            }
            .geo-btn-primary {
                background: #4ade80; color: #000;
            }
            .geo-btn-primary:hover { background: #22c55e; }
            .geo-btn-secondary {
                background: transparent; color: #888; border: 1px solid #444;
            }
            .geo-btn-secondary:hover { color: #fff; border-color: #666; }
            .geo-modal-footer { color: #666; font-size: 11px; margin: 8px 0 0; }
            .geo-modal-footer kbd {
                background: #333; border-radius: 4px; padding: 2px 6px;
                font-family: monospace; font-size: 11px;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'geo-modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ============ PUBLIC API ============
    window.GeoRestriction = {
        check: detectLocation,
        showModal: showGeoModal,
        hideModal: hideGeoModal,
        getCountry: () => userCountry,
        refresh: async () => {
            isRestricted = null;
            detectionPromise = null;
            return await detectLocation();
        },
        clearBypass: () => {
            localStorage.removeItem(BYPASS_KEY);
            isRestricted = null;
            console.log('[Geo] Bypass cleared');
        }
    };

    // ============ INIT ============
    console.log('[Geo] Geo-restriction loaded. Bypass:', hasBypass ? 'YES' : 'NO');
    
    // Pre-detect on page load
    detectLocation().then((restricted) => {
        console.log('[Geo] Initial detection:', restricted ? 'BLOCKED' : 'ALLOWED', '| Country:', userCountry);
    });

})();
