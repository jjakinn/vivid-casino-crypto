/**
 * Geo-Restriction Modal - Extracted from lucky-rollers.io
 * 
 * Detects user location via IP geolocation and shows VPN recommendations
 * only when the user is in a restricted region.
 */

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    // Demo mode: Add ?geo_demo=1 to URL to always show modal (for testing)
    // Override: Add ?geo_allow=1 to bypass all restrictions
    const urlParams = new URLSearchParams(window.location.search);
    const DEMO_MODE = urlParams.get('geo_demo') === '1' || urlParams.get('geo_restrict') === '1';
    const ALLOW_OVERRIDE = urlParams.get('geo_allow') === '1';
    
    // Countries where games are BLOCKED (show modal)
    // Add country codes here as needed
    const BLOCKED_COUNTRIES = [
        "US", // United States
        "GB", // United Kingdom
        "AU", // Australia
        "CA", // Canada
        "FR", // France
        "DE", // Germany
        "IT", // Italy
        "ES", // Spain
        "NL", // Netherlands
        "BE", // Belgium
        "DK", // Denmark
        "SE", // Sweden
        "NO", // Norway
        "FI", // Finland
        "AT", // Austria
        "CH", // Switzerland
        "IE", // Ireland
        "PT", // Portugal
        "GR", // Greece
        "PL", // Poland
        "CZ", // Czech Republic
        "HU", // Hungary
        "SK", // Slovakia
        "SI", // Slovenia
        "HR", // Croatia
        "RO", // Romania
        "BG", // Bulgaria
        "LT", // Lithuania
        "LV", // Latvia
        "EE", // Estonia
        "LU", // Luxembourg
        "MT", // Malta
        "CY", // Cyprus
    ];
    
    // Countries where games are ALLOWED (no modal)
    const ALLOWED_COUNTRIES = [
        "CL", // Chile
        "BO", // Bolivia
        "AR", // Argentina
        "BR", // Brazil
        "MX", // Mexico
        "CO", // Colombia
        "PE", // Peru
        "EC", // Ecuador
        "UY", // Uruguay
        "PY", // Paraguay
        "VE", // Venezuela
        "PA", // Panama
        "CR", // Costa Rica
        "GT", // Guatemala
        "HN", // Honduras
        "SV", // El Salvador
        "NI", // Nicaragua
        "BZ", // Belize
        "JM", // Jamaica
        "TT", // Trinidad and Tobago
        "BB", // Barbados
        "BS", // Bahamas
        "DO", // Dominican Republic
        "CU", // Cuba
        "PR", // Puerto Rico
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
                        { flag: "IE", country: "Ireland", city: "Dublin", speed: { value: 140, unit: "ms" } },
                        { flag: "NZ", country: "New Zealand", city: "Wellington", speed: { value: 200, unit: "ms" } }
                    ]
                }
            }
        },
        emea: {
            title: "Game available in other regions",
            list: {
                default: {
                    title: "Recommended:",
                    items: [
                        { flag: "IE", country: "Ireland", city: "Dublin", speed: { value: 25, unit: "ms" } }
                    ]
                },
                alternative: {
                    title: "Alternatives:",
                    items: [
                        { flag: "CL", country: "Chile", city: "Santiago", speed: { value: 180, unit: "ms" } },
                        { flag: "NZ", country: "New Zealand", city: "Wellington", speed: { value: 220, unit: "ms" } }
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
                        { flag: "IE", country: "Ireland", city: "Dublin", speed: { value: 30, unit: "ms" } }
                    ]
                },
                alternative: {
                    title: "Alternatives:",
                    items: [
                        { flag: "CL", country: "Chile", city: "Santiago", speed: { value: 160, unit: "ms" } },
                        { flag: "NZ", country: "New Zealand", city: "Wellington", speed: { value: 200, unit: "ms" } }
                    ]
                }
            }
        }
    };

    // ============ STATE ============
    let userCountry = null;
    let isRestricted = null; // null = loading, true = blocked, false = allowed
    let modalElement = null;

    // ============ DETECT USER LOCATION ============
    async function detectLocation() {
        // If already detected, return cached result
        if (isRestricted !== null) return isRestricted;
        
        // Override parameter to bypass all restrictions
        if (ALLOW_OVERRIDE) {
            console.log('[GeoRestriction] OVERRIDE: geo_allow=1 detected, allowing access');
            isRestricted = false;
            return false;
        }
        
        // Demo mode always blocks
        if (DEMO_MODE) {
            console.log('[GeoRestriction] DEMO MODE: Always blocking');
            isRestricted = true;
            return true;
        }
        
        // Try multiple IP detection services with fallback
        const ipServices = [
            {
                url: 'https://ipapi.co/json/',
                extract: (data) => data.country_code
            },
            {
                url: 'https://ipinfo.io/json',
                extract: (data) => data.country
            },
            {
                url: 'https://ip-api.com/json/?fields=countryCode',
                extract: (data) => data.countryCode
            }
        ];
        
        for (const service of ipServices) {
            try {
                console.log('[GeoRestriction] Trying IP service:', service.url);
                const response = await fetch(service.url, { 
                    method: 'GET',
                    // Prevent caching
                    cache: 'no-store'
                });
                
                if (!response.ok) {
                    console.warn('[GeoRestriction] Service failed:', service.url, response.status);
                    continue;
                }
                
                const data = await response.json();
                userCountry = service.extract(data);
                console.log('[GeoRestriction] Detected country via', service.url, ':', userCountry);
                
                if (!userCountry) {
                    console.warn('[GeoRestriction] No country code returned from', service.url);
                    continue;
                }
                
                userCountry = userCountry.toUpperCase();
                
                // Check if country is in allowed list
                if (ALLOWED_COUNTRIES.includes(userCountry)) {
                    console.log('[GeoRestriction] Country ALLOWED:', userCountry);
                    isRestricted = false;
                    return false;
                }
                
                // Check if country is in blocked list
                if (BLOCKED_COUNTRIES.includes(userCountry)) {
                    console.log('[GeoRestriction] Country BLOCKED:', userCountry);
                    isRestricted = true;
                    return true;
                }
                
                // Default: allow if not explicitly blocked
                console.log('[GeoRestriction] Country not in lists, allowing:', userCountry);
                isRestricted = false;
                return false;
                
            } catch (err) {
                console.warn('[GeoRestriction] Service error:', service.url, err.message);
                // Continue to next service
            }
        }
        
        // All services failed — default to ALLOWING (not blocking)
        // False positive (blocking a real user) is worse than false negative
        console.warn('[GeoRestriction] All IP detection services failed. Defaulting to ALLOW for safety.');
        console.warn('[GeoRestriction] If you expected a block, check your network/VPN connection.');
        isRestricted = false;
        return false;
    }

    // ============ MODAL FUNCTIONS ============
    function showGeoModal() {
        if (!modalElement) {
            createModal();
        }
        
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
        // Get region-specific data
        const region = getRegionForCountry(userCountry);
        const data = VPN_LOCATIONS[region] || VPN_LOCATIONS.default;
        const t = getTranslation();
        
        const html = `
            <div class="geo-modal-backdrop" id="geoModalBackdrop">
                <div class="geo-modal-content">
                    <button class="geo-modal-close" id="geoModalClose" aria-label="${t.close}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <h2 class="geo-modal-title">${t.title}</h2>
                    
                    <p class="geo-modal-message">${t.message}</p>
                    
                    <div class="geo-locations">
                        <div class="geo-location-section">
                            <h3 class="geo-location-section-title">${t.recommended}</h3>
                            <div class="geo-location-list">
                                ${data.list.default.items.map(item => createLocationItem(item)).join('')}
                            </div>
                        </div>
                        
                        <div class="geo-location-section">
                            <h3 class="geo-location-section-title">${t.alternatives}</h3>
                            <div class="geo-location-list">
                                ${data.list.alternative.items.map(item => createLocationItem(item)).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <p class="geo-modal-description">${t.description}</p>
                    
                    <button class="geo-modal-button" id="geoModalConnect">${t.connect}</button>
                </div>
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        modalElement = wrapper.firstElementChild;
        document.body.appendChild(modalElement);
        
        // Event listeners
        document.getElementById('geoModalClose').addEventListener('click', hideGeoModal);
        document.getElementById('geoModalBackdrop').addEventListener('click', function(e) {
            if (e.target === this) hideGeoModal();
        });
        document.getElementById('geoModalConnect').addEventListener('click', function() {
            window.open('https://nordvpn.com', '_blank');
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalElement.classList.contains('active')) {
                hideGeoModal();
            }
        });
        
        injectStyles();
    }

    function createLocationItem(item) {
        return `
            <div class="geo-location-item">
                <span class="geo-location-flag">${getFlagEmoji(item.flag)}</span>
                <span class="geo-location-country">${item.country}</span>
                <span class="geo-location-city">${item.city}</span>
                <span class="geo-location-speed">${item.speed.value}${item.speed.unit}</span>
            </div>
        `;
    }

    function getFlagEmoji(countryCode) {
        if (!countryCode) return '🌐';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    function getRegionForCountry(countryCode) {
        if (!countryCode) return 'default';
        const americas = ["AG","AR","AW","BS","BB","BZ","BM","BO","BR","CA","KY","CL","CO","CR","CU","CW","DM","DO","EC","SV","GF","GL","GD","GP","GT","GY","HT","HN","JM","MQ","MX","NI","PA","PY","PE","PR","BL","KN","LC","MF","PM","VC","SR","TT","US","UY","VE","VG"];
        const emea = ["AX","AL","DZ","AD","AO","AM","AT","AZ","BH","BY","BE","BJ","BA","BW","BG","BF","BI","CM","CV","CF","TD","KM","CG","CD","HR","CY","CZ","DK","DJ","EG","GQ","ER","EE","SZ","ET","FO","FI","FR","GA","GM","GE","DE","GH","GI","GR","GG","GN","GW","HU","IS","IR","IQ","IE","IM","IL","IT","CI","JE","JO","KE","KW","LV","LB","LS","LR","LY","LI","LT","LU","MG","MW","ML","MT","MR","MU","MD","MC","ME","MA","MZ","NA","NL","NE","NG","MK","NO","OM","PS","PL","PT","QA","RO","RU","RW","SM","ST","SA","SN","RS","SC","SL","SK","SI","SO","ZA","ES","SD","SE","CH","SY","TZ","TG","TN","TR","TM","UG","UA","AE","GB","UZ","VA","YE","ZM","ZW"];
        
        if (americas.includes(countryCode)) return 'americas';
        if (emea.includes(countryCode)) return 'emea';
        return 'default';
    }

    function getTranslation() {
        const lang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
        const translations = {
            en: {
                title: "Game available in other regions",
                recommended: "Recommended:",
                alternatives: "Alternatives:",
                message: "This game is restricted in your current location. Connect to one of the recommended VPN locations below to access it.",
                description: "Use a VPN service to connect to one of these locations and enjoy unrestricted access to all games.",
                close: "Close",
                connect: "Connect Now"
            },
            es: {
                title: "Juego disponible en otras regiones",
                recommended: "Recomendado:",
                alternatives: "Alternativas:",
                message: "Este juego está restringido en tu ubicación actual. Conéctate a una de las ubicaciones de VPN recomendadas a continuación para acceder.",
                description: "Utiliza un servicio VPN para conectarte a una de estas ubicaciones y disfruta de acceso sin restricciones a todos los juegos.",
                close: "Cerrar",
                connect: "Conectar Ahora"
            }
        };
        return translations[lang] || translations.en;
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
                padding: 0; display: flex; align-items: center; justify-content: center;
                width: 24px; height: 24px;
            }
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
        // Check if user is restricted (returns Promise<boolean>)
        check: detectLocation,
        
        // Show modal manually
        showModal: showGeoModal,
        
        // Hide modal
        hideModal: hideGeoModal,
        
        // Get detected country
        getCountry: () => userCountry,
        
        // Force refresh detection
        refresh: async () => {
            isRestricted = null;
            return await detectLocation();
        }
    };

    // ============ INIT ============
    // Start detection immediately
    detectLocation().then(() => {
        console.log('[GeoRestriction] Detection complete. Restricted:', isRestricted);
    });

})();