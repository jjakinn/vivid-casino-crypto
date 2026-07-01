/**
 * Geo-Restriction Modal - lucky-rollers.io style
 * 
 * Detects user location via IP geolocation. If restricted, shows VPN recommendations.
 * If allowed, does nothing (user goes straight to game).
 */

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    const urlParams = new URLSearchParams(window.location.search);
    const DEMO_MODE = urlParams.get('geo_demo') === '1' || urlParams.get('geo_restrict') === '1';
    const ALLOW_OVERRIDE = urlParams.get('geo_allow') === '1';
    
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

    // ============ VPN LOCATION DATA ============
    const VPN_LOCATIONS = {
        americas: {
            title: "Game available in other regions",
            list: {
                default: {
                    title: "Recommended:",
                    items: [
                        { flag: "CL", country: "Chile", city: "Santiago", speed: { value: 30, unit: "ms" } }
                    ]
                },
                alternative: {
                    title: "Alternatives:",
                    items: [
                        { flag: "BO", country: "Bolivia", city: "La Paz", speed: { value: 60, unit: "ms" } },
                        { flag: "AR", country: "Argentina", city: "Buenos Aires", speed: { value: 80, unit: "ms" } },
                        { flag: "BR", country: "Brazil", city: "São Paulo", speed: { value: 100, unit: "ms" } }
                    ]
                }
            }
        },
        default: {
            title: "Game available in other regions",
            list: {
                default: {
                    title: "Recommended:",
                    items: [
                        { flag: "CL", country: "Chile", city: "Santiago", speed: { value: 30, unit: "ms" } }
                    ]
                },
                alternative: {
                    title: "Alternatives:",
                    items: [
                        { flag: "BO", country: "Bolivia", city: "La Paz", speed: { value: 60, unit: "ms" } },
                        { flag: "MX", country: "Mexico", city: "Mexico City", speed: { value: 90, unit: "ms" } },
                        { flag: "BR", country: "Brazil", city: "São Paulo", speed: { value: 100, unit: "ms" } }
                    ]
                }
            }
        }
    };

    // ============ STATE ============
    let userCountry = null;
    let isRestricted = null;
    let modalElement = null;

    // ============ DETECT USER LOCATION ============
    async function detectLocation() {
        if (isRestricted !== null) return isRestricted;
        
        if (ALLOW_OVERRIDE) {
            console.log('[GeoRestriction] OVERRIDE: geo_allow=1');
            isRestricted = false;
            return false;
        }
        
        if (DEMO_MODE) {
            console.log('[GeoRestriction] DEMO MODE');
            isRestricted = true;
            return true;
        }
        
        // Try multiple services with cache-busting
        const timestamp = Date.now();
        const services = [
            { url: `https://ipapi.co/json/?_=${timestamp}`, extract: d => d.country_code },
            { url: `https://ipinfo.io/json?_=${timestamp}`, extract: d => d.country },
            { url: `https://ip-api.com/json/?fields=countryCode&_=${timestamp}`, extract: d => d.countryCode }
        ];
        
        for (const svc of services) {
            try {
                const response = await fetch(svc.url, { 
                    method: 'GET',
                    cache: 'no-store'
                });
                
                if (!response.ok) continue;
                
                const data = await response.json();
                userCountry = (svc.extract(data) || '').toUpperCase();
                
                if (!userCountry) continue;
                
                console.log('[GeoRestriction] Detected:', userCountry);
                
                if (ALLOWED_COUNTRIES.includes(userCountry)) {
                    isRestricted = false;
                    return false;
                }
                
                if (BLOCKED_COUNTRIES.includes(userCountry)) {
                    isRestricted = true;
                    return true;
                }
                
                // Unknown = allow
                isRestricted = false;
                return false;
                
            } catch (err) {
                console.warn('[GeoRestriction] Service failed:', svc.url);
            }
        }
        
        // All failed - default allow
        console.warn('[GeoRestriction] All services failed, defaulting ALLOW');
        isRestricted = false;
        return false;
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
        const region = getRegion(userCountry);
        const data = VPN_LOCATIONS[region] || VPN_LOCATIONS.default;
        
        const html = `
            <div class="geo-modal-backdrop" id="geoModalBackdrop">
                <div class="geo-modal-content">
                    <button class="geo-modal-close" id="geoModalClose">✕</button>
                    
                    <h2 class="geo-modal-title">${data.title}</h2>
                    
                    <p class="geo-modal-message">
                        This game is restricted in your current location (${userCountry || 'Unknown'}). 
                        Connect to one of the recommended VPN locations below to access it.
                    </p>
                    
                    <div class="geo-locations">
                        <div class="geo-location-section">
                            <h3 class="geo-location-section-title">${data.list.default.title}</h3>
                            <div class="geo-location-list">
                                ${data.list.default.items.map(item => locationItem(item)).join('')}
                            </div>
                        </div>
                        
                        <div class="geo-location-section">
                            <h3 class="geo-location-section-title">${data.list.alternative.title}</h3>
                            <div class="geo-location-list">
                                ${data.list.alternative.items.map(item => locationItem(item)).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <p class="geo-modal-description">
                        Use a VPN service to connect to one of these locations and enjoy unrestricted access to all games.
                    </p>
                    
                    <button class="geo-modal-button" id="geoModalConnect">Connect Now</button>
                </div>
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        modalElement = wrapper.firstElementChild;
        document.body.appendChild(modalElement);
        
        document.getElementById('geoModalClose').addEventListener('click', hideGeoModal);
        document.getElementById('geoModalBackdrop').addEventListener('click', (e) => {
            if (e.target === modalElement) hideGeoModal();
        });
        document.getElementById('geoModalConnect').addEventListener('click', () => {
            window.open('https://nordvpn.com', '_blank');
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalElement?.classList.contains('active')) {
                hideGeoModal();
            }
        });
        
        injectStyles();
    }

    function locationItem(item) {
        return `
            <div class="geo-location-item">
                <span class="geo-location-flag">${flagEmoji(item.flag)}</span>
                <span class="geo-location-country">${item.country}</span>
                <span class="geo-location-city">${item.city}</span>
                <span class="geo-location-speed">${item.speed.value}${item.speed.unit}</span>
            </div>
        `;
    }

    function flagEmoji(code) {
        if (!code) return '🌐';
        try {
            const points = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt());
            return String.fromCodePoint(...points);
        } catch { return '🌐'; }
    }

    function getRegion(countryCode) {
        if (!countryCode) return 'default';
        const americas = ["AG","AR","AW","BS","BB","BZ","BM","BO","BR","CA","KY","CL","CO","CR","CU","CW","DM","DO","EC","SV","GF","GL","GD","GP","GT","GY","HT","HN","JM","MQ","MX","NI","PA","PY","PE","PR","BL","KN","LC","MF","PM","VC","SR","TT","US","UY","VE","VG"];
        return americas.includes(countryCode) ? 'americas' : 'default';
    }

    function injectStyles() {
        if (document.getElementById('geo-modal-styles')) return;
        
        const styles = `
            .geo-modal-backdrop {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                z-index: 999999; display: flex; align-items: center; justify-content: center;
                background: rgba(0, 0, 0, 0.64); backdrop-filter: blur(6px);
                opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
            }
            .geo-modal-backdrop.active { opacity: 1; pointer-events: all; }
            .geo-modal-content {
                --width: 328px; align-items: center; background: #0f0f0f;
                border: 1px solid #262626; color: #fcfcfd; display: flex;
                flex-direction: column; margin: 16px; max-height: 90vh;
                max-width: var(--width); overflow-y: auto; padding: 56px 16px 16px;
                position: relative; text-align: center; width: 100%;
                border-radius: 8px; transform: translateY(-20px); transition: transform 0.3s ease;
            }
            .geo-modal-backdrop.active .geo-modal-content { transform: translateY(0); }
            @media (min-width: 768px) {
                .geo-modal-content { --width: 566px; border-radius: 12px; padding: 56px 24px 24px; }
            }
            .geo-modal-close {
                color: #a6a6a6; cursor: pointer; position: absolute;
                top: 16px; right: 16px; background: none; border: none;
                font-size: 18px; padding: 0; width: 32px; height: 32px;
            }
            .geo-modal-close:hover { color: #fff; }
            .geo-modal-title {
                font-weight: 500; letter-spacing: 0.03em; line-height: 1.25;
                margin: 0 0 8px; text-transform: capitalize; font-size: 18px; color: #fcfcfd;
            }
            @media (min-width: 768px) { .geo-modal-title { margin: 0 0 16px; font-size: 24px; } }
            .geo-modal-message { color: #bfbfbf; font-weight: 400; line-height: 1.5;
                margin: 0 0 8px; font-size: 12px;
            }
            @media (min-width: 768px) { .geo-modal-message { margin: 0 0 16px; font-size: 14px; } }
            .geo-modal-description { color: #8c8c8c; margin: 0 0 16px; font-size: 12px; line-height: 1.5; }
            @media (min-width: 768px) { .geo-modal-description { margin: 0 0 24px; font-size: 14px; } }
            .geo-locations { margin-bottom: 16px; max-width: 100%; width: 100%; }
            .geo-location-section { margin-bottom: 16px; }
            .geo-location-section-title {
                color: #bfbfbf; font-size: 12px; font-weight: 600;
                margin: 0 0 8px; text-align: left; text-transform: uppercase; letter-spacing: 0.05em;
            }
            @media (min-width: 768px) { .geo-location-section-title { font-size: 14px; margin: 0 0 12px; } }
            .geo-location-list { display: flex; flex-direction: column; gap: 8px; }
            .geo-location-item {
                display: flex; align-items: center; gap: 12px; padding: 12px;
                background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; text-align: left;
            }
            @media (min-width: 768px) { .geo-location-item { padding: 16px; gap: 16px; } }
            .geo-location-flag { font-size: 24px; line-height: 1; flex-shrink: 0; }
            @media (min-width: 768px) { .geo-location-flag { font-size: 32px; } }
            .geo-location-country { color: #fcfcfd; font-weight: 600; font-size: 14px; flex: 1; }
            @media (min-width: 768px) { .geo-location-country { font-size: 16px; } }
            .geo-location-city { color: #8c8c8c; font-size: 12px; }
            @media (min-width: 768px) { .geo-location-city { font-size: 14px; } }
            .geo-location-speed { color: #46b770; font-size: 12px; font-weight: 600; margin-left: auto; flex-shrink: 0; }
            @media (min-width: 768px) { .geo-location-speed { font-size: 14px; } }
            .geo-modal-button {
                background: #ff3636; color: #fcfcfd; border: none; border-radius: 4px;
                padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease;
                width: 100%; margin-top: 8px;
            }
            @media (min-width: 768px) { .geo-modal-button { width: auto; min-width: 200px; padding: 14px 28px; font-size: 16px; } }
            .geo-modal-button:hover { background: #ff4d4d; transform: translateY(-1px); }
            .geo-modal-button:active { transform: translateY(0); }
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
            return await detectLocation();
        }
    };

    // Pre-detect on load
    detectLocation().then(() => {
        console.log('[GeoRestriction] Init complete. Restricted:', isRestricted, 'Country:', userCountry);
    });

})();
