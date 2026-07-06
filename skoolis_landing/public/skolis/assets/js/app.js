// ============================================
// app.js - Application principale Skoolis
// ============================================

// ========== CONFIGURATION GLOBALE ==========
const AppConfig = {
    version: '1.0.0',
    name: 'Skoolis',
    theme: {
        default: 'light',
        storageKey: 'skoolis-theme'
    },
    sidebar: {
        storageKey: 'skoolis-sidebar-state'
    },
    notifications: {
        duration: 3000
    }
};

// ========== GESTION DU THÈME ==========
const ThemeManager = {
    /**
     * Initialise le gestionnaire de thème
     */
    init() {
        const themeToggleBtn = document.getElementById('themeToggle');

        if (!themeToggleBtn) return;

        const themeIcon = themeToggleBtn.querySelector('i');

        // Restaurer le thème sauvegardé ou utiliser la préférence système
        const savedTheme = Utils.storage.get(AppConfig.theme.storageKey);

        if (savedTheme) {
            this.applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(prefersDark ? 'dark' : 'light');
        }

        // Gestionnaire de clic sur le bouton
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    },

    /**
     * Applique un thème
     * @param {string} theme - 'dark' ou 'light'
     */
    applyTheme(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        const oneYearSeconds = 60 * 60 * 24 * 365;

        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }

        Utils.storage.set(AppConfig.theme.storageKey, theme);
        const cookieMatch = document.cookie.match(/(?:^|;\s*)skoolis-theme=([^;]*)/);
        const currentCookie = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
        if (currentCookie !== theme) {
            document.cookie = `skoolis-theme=${theme}; path=/; max-age=${oneYearSeconds}; SameSite=Lax`;
        }

        // Mettre à jour les graphiques si Chart.js est présent
        if (typeof Chart !== 'undefined' && window.chartInstances) {
            this.updateChartsTheme(theme);
        }
    },

    /**
     * Met à jour le thème des graphiques
     * @param {string} theme - Thème appliqué
     */
    updateChartsTheme(theme) {
        const isDark = theme === 'dark';

        Object.values(window.chartInstances || {}).forEach(chart => {
            if (chart.options && chart.options.plugins) {
                // Mise à jour des couleurs
                if (chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                    chart.options.plugins.legend.labels.color = isDark ? '#f5f5f5' : '#333333';
                }

                if (chart.options.plugins.tooltip) {
                    chart.options.plugins.tooltip.backgroundColor = isDark ? '#1e1e1e' : '#ffffff';
                    chart.options.plugins.tooltip.titleColor = isDark ? '#f5f5f5' : '#333333';
                    chart.options.plugins.tooltip.bodyColor = isDark ? '#f5f5f5' : '#333333';
                }

                // Mise à jour des axes
                if (chart.options.scales) {
                    ['x', 'y'].forEach(axis => {
                        if (chart.options.scales[axis]) {
                            if (chart.options.scales[axis].ticks) {
                                chart.options.scales[axis].ticks.color = isDark ? '#cccccc' : '#666666';
                            }
                            if (chart.options.scales[axis].grid) {
                                chart.options.scales[axis].grid.color = isDark
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : 'rgba(0, 0, 0, 0.05)';
                            }
                        }
                    });
                }

                chart.update();
            }
        });
    }
};

// ========== GESTION DE LA SIDEBAR ==========
const SidebarManager = {
    /**
     * Initialise la sidebar
     */
    init() {
        const toggleSidebarBtn = document.getElementById('toggleSidebar');
        const sidebar = document.querySelector('.sidebar');

        if (!toggleSidebarBtn || !sidebar) return;

        // Restaurer l'état de la sidebar
        const sidebarState = Utils.storage.get(AppConfig.sidebar.storageKey);
        if (sidebarState === 'active') {
            sidebar.classList.add('active');
        }

        // Toggle sidebar
        toggleSidebarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');

            // Sauvegarder l'état
            const isActive = sidebar.classList.contains('active');
            Utils.storage.set(AppConfig.sidebar.storageKey, isActive ? 'active' : 'inactive');
        });

        // Fermer la sidebar en cliquant à l'extérieur sur mobile
        document.addEventListener('click', (event) => {
            const isMobile = window.innerWidth <= 992;

            if (!sidebar || !toggleSidebarBtn) return;

            const isSidebarOpen = sidebar.classList.contains('active');
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggleBtn = toggleSidebarBtn.contains(event.target);

            if (isMobile && isSidebarOpen && !isClickInsideSidebar && !isClickOnToggleBtn) {
                sidebar.classList.remove('active');
            }
        });
    },

    /**
     * Ouvre la sidebar
     */
    open() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.add('active');
            Utils.storage.set(AppConfig.sidebar.storageKey, 'active');
        }
    },

    /**
     * Ferme la sidebar
     */
    close() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
            Utils.storage.set(AppConfig.sidebar.storageKey, 'inactive');
        }
    }
};

// ========== GESTION DE LA NAVIGATION ==========
const NavigationManager = {
    /**
     * Initialise la navigation active
     */
    init() {
        this.initActiveNavigation();
        this.initDropdownNavigation();
    },

    refreshActiveNavigation() {
        const navItems = document.querySelectorAll('.nav-item:not(.dropdown)');
        const pathname = window.location.pathname.replace(/\/+$/, '') || '/app';
        const currentRoute = pathname === '/app' || pathname.endsWith('/app')
            ? '/app'
            : pathname;

        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const normalizedHref = href.startsWith('/app')
                ? href.replace(/\/+$/, '')
                : href;

            item.classList.toggle('active', normalizedHref === currentRoute);
        });
    },

    /**
     * Gère la navigation active
     */
    initActiveNavigation() {
        const navItems = document.querySelectorAll('.nav-item:not(.dropdown)');
        const pathname = window.location.pathname.replace(/\/+$/, '') || '/app';
        const currentRoute = pathname === '/app' || pathname.endsWith('/app')
            ? '/app'
            : pathname;

        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const normalizedHref = href.startsWith('/app')
                ? href.replace(/\/+$/, '')
                : href;

            if (normalizedHref === currentRoute) {
                document.querySelectorAll('.nav-item:not(.dropdown)').forEach(navItem =>
                    navItem.classList.remove('active')
                );
                item.classList.add('active');
            }

            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') return;

                document.querySelectorAll('.nav-item:not(.dropdown)').forEach(navItem =>
                    navItem.classList.remove('active')
                );

                item.classList.add('active');

                if (window.innerWidth <= 992) {
                    SidebarManager.close();
                }
            });
        });
    },

    /**
     * Gère les dropdowns de navigation
     */
    initDropdownNavigation() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();

                const dropdown = toggle.closest('.dropdown');
                const isActive = dropdown.classList.contains('active');

                // Fermer tous les autres dropdowns
                document.querySelectorAll('.dropdown').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });

                // Toggle le dropdown actuel
                dropdown.classList.toggle('active');
            });
        });
    }

};

// ========== GESTION DES POPUPS/MODALS ==========
const PopupManager = {
    /**
     * Initialise les popups
     */
    init() {
        // Initialiser les boutons de fermeture
        document.querySelectorAll('.popup-close, .modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const popup = btn.closest('.popup, .modal');
                if (popup) {
                    this.close(popup.id);
                }
            });
        });

        // Fermer en cliquant à l'extérieur
        document.querySelectorAll('.popup, .modal').forEach(popup => {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.close(popup.id);
                }
            });
        });
    },

    /**
     * Ouvre un popup
     * @param {string} popupId - ID du popup
     */
    open(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * Ferme un popup
     * @param {string} popupId - ID du popup
     */
    close(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';

            // Réinitialiser le formulaire si présent
            const form = popup.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    },

    /**
     * Ferme tous les popups
     */
    closeAll() {
        document.querySelectorAll('.popup, .modal').forEach(popup => {
            popup.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
};

// Gestion des onglets de configuration
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.config-tab');
    const sections = document.querySelectorAll('.config-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetTab = this.dataset.tab; // 'school' ou 'system'

            // Désactiver tous les onglets et sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Activer l'onglet cliqué
            this.classList.add('active');

            // Activer la section correspondante
            const targetSection = document.getElementById(targetTab + '-config');
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});

// ========== GESTION DES TABLEAUX ==========
const TableManager = {
    /**
     * Initialise les tableaux
     */
    init() {
        this.initResponsiveTables();
        this.initTableSearch();
        this.initTableSort();
    },

    /**
     * Rend les tableaux responsives
     */
    initResponsiveTables() {
        const adjustTableForMobile = () => {
            const tables = document.querySelectorAll('.data-table');

            tables.forEach(table => {
                if (window.innerWidth < 768) {
                    table.classList.add('mobile-table');
                } else {
                    table.classList.remove('mobile-table');
                }
            });
        };

        // Ajustement initial
        adjustTableForMobile();

        // Ajuster au redimensionnement
        window.addEventListener('resize', Utils.debounce(adjustTableForMobile, 250));
    },

    /**
     * Initialise la recherche dans les tableaux
     */
    initTableSearch() {
        const searchInputs = document.querySelectorAll('[data-table-search]');

        searchInputs.forEach(input => {
            const tableId = input.getAttribute('data-table-search');
            const table = document.getElementById(tableId);

            if (!table) return;

            input.addEventListener('keyup', Utils.debounce((e) => {
                const searchTerm = e.target.value.toLowerCase();
                const rows = table.querySelectorAll('tbody tr');

                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }, 300));
        });
    },

    /**
     * Initialise le tri des tableaux
     */
    initTableSort() {
        const sortableHeaders = document.querySelectorAll('th[data-sortable]');

        sortableHeaders.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const table = header.closest('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const columnIndex = Array.from(header.parentElement.children).indexOf(header);
                const isAscending = header.classList.contains('sort-asc');

                // Retirer les classes de tri des autres colonnes
                header.parentElement.querySelectorAll('th').forEach(th => {
                    th.classList.remove('sort-asc', 'sort-desc');
                });

                // Ajouter la classe appropriée
                header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');

                // Trier les lignes
                rows.sort((a, b) => {
                    const aValue = a.children[columnIndex].textContent.trim();
                    const bValue = b.children[columnIndex].textContent.trim();

                    // Essayer de comparer comme nombres
                    const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
                    const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));

                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return isAscending ? bNum - aNum : aNum - bNum;
                    }

                    // Sinon comparer comme chaînes
                    return isAscending
                        ? bValue.localeCompare(aValue)
                        : aValue.localeCompare(bValue);
                });

                // Réappliquer les lignes triées
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    }
};

// ========== GESTION DES GRAPHIQUES ==========
const ChartManager = {
    charts: {},

    /**
     * Initialise les graphiques
     */
    init() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js n\'est pas chargé');
            return;
        }

        // Configuration globale de Chart.js
        Chart.defaults.font.family = "'Poppins', sans-serif";
        Chart.defaults.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-color').trim();

        // Stocker les instances pour référence
        window.chartInstances = this.charts;
    },

    /**
     * Crée un graphique
     * @param {string} canvasId - ID du canvas
     * @param {object} config - Configuration du graphique
     * @returns {Chart} Instance du graphique
     */
    create(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const chart = new Chart(canvas, config);
        this.charts[canvasId] = chart;

        return chart;
    },

    /**
     * Détruit un graphique
     * @param {string} canvasId - ID du canvas
     */
    destroy(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }
    },

    /**
     * Met à jour un graphique
     * @param {string} canvasId - ID du canvas
     * @param {object} data - Nouvelles données
     */
    update(canvasId, data) {
        const chart = this.charts[canvasId];
        if (chart) {
            chart.data = data;
            chart.update();
        }
    }
};

// ========== GESTION DES FORMULAIRES ==========
const FormManager = {
    /**
     * Initialise les formulaires
     */
    init() {
        // Gestion de la validation en temps réel
        document.querySelectorAll('form[data-validate]').forEach(form => {
            this.enableLiveValidation(form);
        });

        // Gestion de la soumission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (form.hasAttribute('data-validate')) {
                    const validation = Utils.validateForm(form);
                    if (!validation.valid) {
                        e.preventDefault();
                        this.showErrors(form, validation.errors);
                    }
                }
            });
        });
    },

    /**
     * Active la validation en temps réel
     * @param {HTMLFormElement} form - Formulaire
     */
    enableLiveValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                // Effacer le message d'erreur pendant la saisie
                const errorElement = input.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                    input.classList.remove('error');
                }
            });
        });
    },

    /**
     * Valide un champ
     * @param {HTMLElement} field - Champ à valider
     */
    validateField(field) {
        let isValid = true;
        let errorMessage = '';

        // Validation required
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est requis';
        }

        // Validation email
        if (field.type === 'email' && field.value && !Utils.validateEmail(field.value)) {
            isValid = false;
            errorMessage = 'Email invalide';
        }

        // Validation téléphone
        if (field.type === 'tel' && field.value && !Utils.validatePhone(field.value)) {
            isValid = false;
            errorMessage = 'Numéro de téléphone invalide';
        }

        // Afficher ou masquer l'erreur
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    },

    /**
     * Affiche une erreur sur un champ
     * @param {HTMLElement} field - Champ
     * @param {string} message - Message d'erreur
     */
    showFieldError(field, message) {
        this.clearFieldError(field);

        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #f44336;
            font-size: 12px;
            margin-top: 4px;
            display: block;
        `;

        field.parentElement.appendChild(errorElement);
    },

    /**
     * Efface l'erreur d'un champ
     * @param {HTMLElement} field - Champ
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    },

    /**
     * Affiche toutes les erreurs d'un formulaire
     * @param {HTMLFormElement} form - Formulaire
     * @param {array} errors - Liste des erreurs
     */
    showErrors(form, errors) {
        errors.forEach(error => {
            const field = form.querySelector(`[name="${error.field}"], #${error.field}`);
            if (field) {
                this.showFieldError(field, error.message);
            }
        });

        Utils.showNotification('Veuillez corriger les erreurs', 'error');
    }
};

// ========== GESTION DES NOTIFICATIONS ==========
const NotificationManager = {
    /**
     * Initialise le gestionnaire de notifications
     */
    init() {
        const notificationBtn = document.querySelector('.notification');

        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotificationPanel();
            });
        }
    },

    /**
     * Affiche le panneau de notifications
     */
    showNotificationPanel() {
        // TODO: Implémenter le panneau de notifications
        Utils.showNotification('Fonctionnalité à venir', 'info');
    }
};

// ========== GESTION DE LA RECHERCHE GLOBALE ==========
const SearchManager = {
    /**
     * Initialise la recherche globale
     */
    init() {
        const searchInput = document.querySelector('.search-box input');

        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim();
                    if (searchTerm) {
                        this.performSearch(searchTerm);
                        searchInput.value = '';
                    }
                }
            });
        }
    },

    /**
     * Effectue une recherche
     * @param {string} term - Terme de recherche
     */
    performSearch(term) {
        // TODO: Implémenter la recherche réelle
        console.log('Recherche de:', term);
        Utils.showNotification(`Recherche de: ${term}`, 'info');
    }
};

// ========== INITIALISATION GLOBALE ==========
class SkoolisApp {
    constructor() {
        this.config = AppConfig;
        this.initialized = false;
    }

    /**
     * Initialise l'application
     */
    init() {
        if (this.initialized) return;

        console.log(`Initialisation de ${AppConfig.name} v${AppConfig.version}...`);

        // Initialiser tous les gestionnaires
        ThemeManager.init();
        SidebarManager.init();
        NavigationManager.init();
        PopupManager.init();
        FeatureManager.init();
        TableManager.init();
        ChartManager.init();
        FormManager.init();
        NotificationManager.init();
        SearchManager.init();

        this.initialized = true;

        console.log('✓ Application initialisée avec succès');
    }
}

// ========== DÉMARRAGE DE L'APPLICATION ==========
let skoolisAppInstance = null;

const startSkoolisApp = () => {
    if (typeof Utils === 'undefined') {
        setTimeout(startSkoolisApp, 16);
        return;
    }

    if (skoolisAppInstance?.initialized) {
        NavigationManager.refreshActiveNavigation();
        ChartManager.init();
        FeatureManager.init();
        return;
    }

    skoolisAppInstance = new SkoolisApp();
    skoolisAppInstance.init();

    // Exposer les gestionnaires globalement
    window.Skoolis = {
        app: skoolisAppInstance,
        Theme: ThemeManager,
        Sidebar: SidebarManager,
        Navigation: NavigationManager,
        Popup: PopupManager,
        Feature: FeatureManager,
        Table: TableManager,
        Chart: ChartManager,
        Form: FormManager,
        Notification: NotificationManager,
        Search: SearchManager
    };

    // Exposer également les fonctions courantes
    window.openPopup = (id) => PopupManager.open(id);
    window.closePopup = (id) => PopupManager.close(id);
    window.showNotification = (msg, type, duration) => Utils.showNotification(msg, type, duration);
};

window.__initSkoolisApp = startSkoolisApp;

if (!window.__skoolisAppBootstrapped) {
    window.__skoolisAppBootstrapped = true;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSkoolisApp, { once: true });
    } else {
        setTimeout(startSkoolisApp, 0);
    }
}
// ========== GESTION DES ONGLETS FEATURE ==========
const FeatureManager = {
    init() {
        const featureBtns = document.querySelectorAll('.feature-btn');
        if (!featureBtns.length) return;

        featureBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFeature = btn.getAttribute('data-feature');
                if (!targetFeature) return;

                // Désactiver tous les boutons et sections
                featureBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.feature-section').forEach(s => s.classList.remove('active'));

                // Activer le bouton et la section cliqués
                btn.classList.add('active');
                const targetSection = document.getElementById(targetFeature);
                if (targetSection) targetSection.classList.add('active');
            });
        });
    }
};
