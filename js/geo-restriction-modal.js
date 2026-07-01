/**
 * Geo-Restriction Modal - Extracted from lucky-rollers.io
 * Original source: https://lucky-rollers.io/js/main.4ca4e38f.js
 * 
 * This module shows a modal when a user clicks on a game that is not
 * available in their region, displaying VPN location recommendations.
 */

(function() {
    'use strict';

    // Enable demo mode via URL: ?geo_demo=1 or ?geo_restrict=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('geo_demo') === '1' || urlParams.get('geo_restrict') === '1') {
        window.GEO_RESTRICT_DEMO = true;
        console.log('[GeoRestriction] DEMO MODE ENABLED - All games will show restriction modal');
    }

    // Configuration - IP country code detection
    const GEO_CONFIG = {
        // Americas region IPs
        americas: ["AG","AR","AW","BS","BB","BZ","BM","BO","BR","CA","KY","CL","CO","CR","CU","CW","DM","DO","EC","SV","GF","GL","GD","GP","GT","GY","HT","HN","JM","MQ","MX","NI","PA","PY","PE","PR","BL","KN","LC","MF","PM","VC","SR","TT","US","UY","VE","VG"],
        
        // Europe/Africa/Asia region IPs  
        emea: ["AX","AL","DZ","AD","AO","AM","AT","AZ","BH","BY","BE","BJ","BA","BW","BG","BF","BI","CM","CV","CF","TD","KM","CG","CD","HR","CY","CZ","DK","DJ","EG","GQ","ER","EE","SZ","ET","FO","FI","FR","GA","GM","GE","DE","GH","GI","GR","GG","GN","GW","HU","IS","IR","IQ","IE","IM","IL","IT","CI","JE","JO","KE","KW","LV","LB","LS","LR","LY","LI","LT","LU","MG","MW","ML","MT","MR","MU","MD","MC","ME","MA","MZ","NA","NL","NE","NG","MK","NO","OM","PS","PL","PT","QA","RO","RU","RW","SM","ST","SA","SN","RS","SC","SL","SK","SI","SO","ZA","ES","SD","SE","CH","SY","TZ","TG","TN","TR","TM","UG","UA","AE","GB","UZ","VA","YE","ZM","ZW"],
        
        // Default (no filter)
        default: true
    };

    // VPN Location Data - EXACT from lucky-rollers.io source
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

    // Translations
    const TRANSLATIONS = {
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
        },
        de: {
            title: "Spiel in anderen Regionen verfügbar",
            recommended: "Empfohlen:",
            alternatives: "Alternativen:",
            message: "Dieses Spiel ist an Ihrem aktuellen Standort eingeschränkt. Verbinden Sie sich mit einem der empfohlenen VPN-Standorte unten, um darauf zuzugreifen.",
            description: "Verwenden Sie einen VPN-Dienst, um sich mit einem dieser Standorte zu verbinden und genießen Sie uneingeschränkten Zugriff auf alle Spiele.",
            close: "Schließen",
            connect: "Jetzt Verbinden"
        }
    };

    // Get user's region based on IP (simulated - in production this would come from backend)
    function getUserRegion() {
        // In production, this would be determined by server-side IP geolocation
        // For now, we'll use a default region
        // You can override this by setting window.USER_REGION before loading this script
        if (window.USER_REGION) {
            return window.USER_REGION;
        }
        
        // Try to detect from browser locale
        const locale = navigator.language || navigator.userLanguage || 'en';
        if (locale.startsWith('es')) return 'americas';
        if (locale.startsWith('de')) return 'emea';
        
        return 'default';
    }

    // Get translation based on browser language
    function getTranslation() {
        const lang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
        return TRANSLATIONS[lang] || TRANSLATIONS.en;
    }

    // Create flag emoji from country code
    function getFlagEmoji(countryCode) {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    // Create the modal HTML structure
    function createModalHTML() {
        const region = getUserRegion();
        const data = VPN_LOCATIONS[region] || VPN_LOCATIONS.default;
        const t = getTranslation();
        
        const locationItem = (item) => `
            <div class="geo-location-item">
                <span class="geo-location-flag">${getFlagEmoji(item.flag)}</span>
                <span class="geo-location-country">${item.country}</span>
                <span class="geo-location-city">${item.city}</span>
                <span class="geo-location-speed">${item.speed.value}${item.speed.unit}</span>
            </div>
        `;

        return `
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
                                ${data.list.default.items.map(locationItem).join('')}
                            </div>
                        </div>
                        
                        <div class="geo-location-section">
                            <h3 class="geo-location-section-title">${t.alternatives}</h3>
                            <div class="geo-location-list">
                                ${data.list.alternative.items.map(locationItem).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <p class="geo-modal-description">${t.description}</p>
                    
                    <button class="geo-modal-button" id="geoModalConnect">${t.connect}</button>
                </div>
            </div>
        `;
    }

    // Inject styles - EXACT match to lucky-rollers.io CSS
    function injectStyles() {
        const styles = `
            /* Geo Restriction Modal - Extracted from lucky-rollers.io */
            .geo-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.64);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .geo-modal-backdrop.active {
                opacity: 1;
                pointer-events: all;
            }
            
            .geo-modal-content {
                --width: 328px;
                align-items: center;
                background: #0f0f0f;
                border: 1px solid #262626;
                color: #fcfcfd;
                display: flex;
                flex-direction: column;
                margin: 16px;
                max-height: 90vh;
                max-width: var(--width);
                overflow-y: auto;
                padding: 56px 16px 16px;
                position: relative;
                text-align: center;
                width: 100%;
                border-radius: 8px;
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }
            
            .geo-modal-backdrop.active .geo-modal-content {
                transform: translateY(0);
            }
            
            @media (min-width: 768px) {
                .geo-modal-content {
                    --width: 566px;
                    border-radius: 12px;
                    padding: 56px 24px 24px;
                }
            }
            
            .geo-modal-close {
                --icon-size: 24px;
                color: #a6a6a6;
                cursor: pointer;
                position: absolute;
                text-decoration: none;
                top: 16px;
                right: 16px;
                transition: color 0.3s ease;
                background: none;
                border: none;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: var(--icon-size);
                height: var(--icon-size);
            }
            
            @media (min-width: 1280px) {
                .geo-modal-close {
                    top: 32px;
                    right: 32px;
                }
            }
            
            @media (min-width: 768px) {
                .geo-modal-close:hover {
                    color: #bfbfbf;
                }
            }
            
            .geo-modal-title {
                font-weight: 500;
                letter-spacing: 0.03em;
                line-height: 1.25;
                margin: 0 0 8px;
                text-transform: capitalize;
                font-size: 18px;
                color: #fcfcfd;
            }
            
            @media (min-width: 768px) {
                .geo-modal-title {
                    margin: 0 0 16px;
                    font-size: 24px;
                }
            }
            
            .geo-modal-message {
                color: #bfbfbf;
                font-weight: 400;
                line-height: 1.5;
                margin: 0 0 8px;
                font-size: 12px;
            }
            
            @media (min-width: 768px) {
                .geo-modal-message {
                    margin: 0 0 16px;
                    font-size: 14px;
                }
            }
            
            .geo-modal-description {
                color: #8c8c8c;
                margin: 0 0 16px;
                font-size: 12px;
                line-height: 1.5;
            }
            
            @media (min-width: 768px) {
                .geo-modal-description {
                    margin: 0 0 24px;
                    font-size: 14px;
                }
            }
            
            .geo-locations {
                margin-bottom: 16px;
                max-width: 100%;
                width: 100%;
            }
            
            .geo-location-section {
                margin-bottom: 16px;
            }
            
            .geo-location-section-title {
                color: #bfbfbf;
                font-size: 12px;
                font-weight: 600;
                margin: 0 0 8px;
                text-align: left;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            @media (min-width: 768px) {
                .geo-location-section-title {
                    font-size: 14px;
                    margin: 0 0 12px;
                }
            }
            
            .geo-location-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .geo-location-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: #1a1a1a;
                border: 1px solid #262626;
                border-radius: 8px;
                text-align: left;
            }
            
            @media (min-width: 768px) {
                .geo-location-item {
                    padding: 16px;
                    gap: 16px;
                }
            }
            
            .geo-location-flag {
                font-size: 24px;
                line-height: 1;
                flex-shrink: 0;
            }
            
            @media (min-width: 768px) {
                .geo-location-flag {
                    font-size: 32px;
                }
            }
            
            .geo-location-country {
                color: #fcfcfd;
                font-weight: 600;
                font-size: 14px;
                flex: 1;
            }
            
            @media (min-width: 768px) {
                .geo-location-country {
                    font-size: 16px;
                }
            }
            
            .geo-location-city {
                color: #8c8c8c;
                font-size: 12px;
            }
            
            @media (min-width: 768px) {
                .geo-location-city {
                    font-size: 14px;
                }
            }
            
            .geo-location-speed {
                color: #46b770;
                font-size: 12px;
                font-weight: 600;
                margin-left: auto;
                flex-shrink: 0;
            }
            
            @media (min-width: 768px) {
                .geo-location-speed {
                    font-size: 14px;
                }
            }
            
            .geo-modal-button {
                background: #ff3636;
                color: #fcfcfd;
                border: none;
                border-radius: 4px;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease;
                width: 100%;
                margin-top: 8px;
            }
            
            @media (min-width: 768px) {
                .geo-modal-button {
                    width: auto;
                    min-width: 200px;
                    padding: 14px 28px;
                    font-size: 16px;
                }
            }
            
            .geo-modal-button:hover {
                background: #ff4d4d;
                transform: translateY(-1px);
            }
            
            .geo-modal-button:active {
                transform: translateY(0);
            }
            
            /* Scrollbar styling matching lucky-rollers.io */
            .geo-modal-content::-webkit-scrollbar {
                height: 4px;
                width: 4px;
            }
            
            .geo-modal-content::-webkit-scrollbar-track {
                background: rgba(252, 252, 253, 0.08);
                border-radius: 80px;
            }
            
            .geo-modal-content::-webkit-scrollbar-thumb {
                background: rgba(252, 252, 253, 0.24);
                border-radius: 80px;
            }
            
            .geo-modal-content::-webkit-scrollbar-thumb:hover {
                background: rgba(252, 252, 253, 0.24);
            }
            
            @supports (-moz-appearance: none) {
                .geo-modal-content {
                    scrollbar-color: rgba(252, 252, 253, 0.24) rgba(252, 252, 253, 0.08);
                    scrollbar-width: thin;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Modal instance
    let modalElement = null;
    let backdropElement = null;

    // Show the modal
    function showGeoModal() {
        if (!modalElement) {
            injectStyles();
            
            const wrapper = document.createElement('div');
            wrapper.innerHTML = createModalHTML();
            modalElement = wrapper.firstElementChild;
            document.body.appendChild(modalElement);
            
            // Event listeners
            document.getElementById('geoModalClose').addEventListener('click', hideGeoModal);
            document.getElementById('geoModalBackdrop').addEventListener('click', function(e) {
                if (e.target === this) hideGeoModal();
            });
            document.getElementById('geoModalConnect').addEventListener('click', function() {
                // In production, this would redirect to VPN affiliate link
                window.open('https://nordvpn.com', '_blank');
            });
            
            // Escape key to close
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modalElement.classList.contains('active')) {
                    hideGeoModal();
                }
            });
        }
        
        // Show modal
        requestAnimationFrame(() => {
            modalElement.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Hide the modal
    function hideGeoModal() {
        if (modalElement) {
            modalElement.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Check if game is restricted
    // Set window.GEO_RESTRICT_DEMO = true to test (shows modal on ALL games)
    // Set window.GEO_RESTRICT_REGION = 'americas|emea|default' for region-specific
    function isGameRestricted(gameId) {
        // DEMO MODE: If enabled, all games appear restricted
        if (window.GEO_RESTRICT_DEMO === true) {
            return true;
        }
        
        // In production, this would check user's IP country against game's allowed countries
        // For now, return false unless demo mode is on
        return false;
    }

    // Initialize geo-restriction on game elements
    // Uses event delegation for dynamically created game tiles
    function initGeoRestriction() {
        // Wait for DOM to be fully loaded including dynamic content
        function attachListeners() {
            // Event delegation - catch clicks on game tiles
            document.addEventListener('click', function(e) {
                // Find closest game tile or game link
                const gameTile = e.target.closest('.game-tile, [data-game-id], .game-link, .game-card, a[href*="game.html"]');
                
                if (!gameTile) return;
                
                // Check if restricted
                if (isGameRestricted('game')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    showGeoModal();
                    return false;
                }
            }, true); // Use capture phase to intercept before other handlers
            
            // Also intercept on the window level for any navigation
            window.addEventListener('beforeunload', function(e) {
                if (modalElement && modalElement.classList.contains('active')) {
                    e.preventDefault();
                    e.returnValue = '';
                    return '';
                }
            });
        }
        
        // Attach immediately
        attachListeners();
        
        // Also attach after a delay for dynamically loaded content
        setTimeout(attachListeners, 1000);
        setTimeout(attachListeners, 3000);
    }

    // Expose API
    window.GeoRestrictionModal = {
        show: showGeoModal,
        hide: hideGeoModal,
        isRestricted: isGameRestricted,
        init: initGeoRestriction
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGeoRestriction);
    } else {
        initGeoRestriction();
    }

    // Also initialize when new content is loaded (for SPAs)
    const observer = new MutationObserver(function(mutations) {
        initGeoRestriction();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();