// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupSystemThemeDetection();
    }

    // Apply theme to the document
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            this.updateThemeToggleIcon('moon');
        } else {
            root.removeAttribute('data-theme');
            this.updateThemeToggleIcon('sun');
        }

        this.currentTheme = theme;
        localStorage.setItem('theme', theme);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    // Setup event listeners
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Setup system theme detection on load
    setupSystemThemeDetection() {
        // If no theme is stored, use system preference
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    // Toggle between themes
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add transition effect
        this.addThemeTransition();
    }

    // Update theme toggle icon
    updateThemeToggleIcon(icon) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = `<i class="fas fa-${icon}"></i>`;
        }
    }

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme) {
        let themeColor = '#ffffff'; // Light theme default
        
        if (theme === 'dark') {
            themeColor = '#111827'; // Dark theme default
        }

        // Update existing meta tag or create new one
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = themeColor;

        // Update apple-touch-icon meta tag
        let metaAppleThemeColor = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!metaAppleThemeColor) {
            metaAppleThemeColor = document.createElement('meta');
            metaAppleThemeColor.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(metaAppleThemeColor);
        }
        metaAppleThemeColor.content = theme === 'dark' ? 'black-translucent' : 'default';
    }

    // Add smooth transition when switching themes
    addThemeTransition() {
        const transition = document.createElement('style');
        transition.textContent = `
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
        `;
        document.head.appendChild(transition);

        // Remove transition after animation completes
        setTimeout(() => {
            transition.remove();
        }, 300);
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Set specific theme
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }

    // Reset to system theme
    resetToSystemTheme() {
        localStorage.removeItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Get CSS custom properties for current theme
    getThemeColors() {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        
        return {
            primary: styles.getPropertyValue('--primary-color').trim(),
            primaryDark: styles.getPropertyValue('--primary-dark').trim(),
            primaryLight: styles.getPropertyValue('--primary-light').trim(),
            secondary: styles.getPropertyValue('--secondary-color').trim(),
            accent: styles.getPropertyValue('--accent-color').trim(),
            textPrimary: styles.getPropertyValue('--text-primary').trim(),
            textSecondary: styles.getPropertyValue('--text-secondary').trim(),
            textLight: styles.getPropertyValue('--text-light').trim(),
            bgPrimary: styles.getPropertyValue('--bg-primary').trim(),
            bgSecondary: styles.getPropertyValue('--bg-secondary').trim(),
            bgTertiary: styles.getPropertyValue('--bg-tertiary').trim(),
            borderColor: styles.getPropertyValue('--border-color').trim()
        };
    }

    // Generate theme palette for charts or other components
    getThemePalette() {
        const colors = this.getThemeColors();
        
        return {
            primary: [colors.primary, colors.primaryDark, colors.primaryLight],
            secondary: [colors.secondary, '#059669', '#10b981'],
            accent: [colors.accent, '#d97706', '#f59e0b'],
            neutral: [colors.textPrimary, colors.textSecondary, colors.textLight],
            background: [colors.bgPrimary, colors.bgSecondary, colors.bgTertiary],
            border: [colors.borderColor, '#d1d5db', '#e5e7eb']
        };
    }

    // Apply theme to specific component
    applyThemeToComponent(component, theme = null) {
        const targetTheme = theme || this.currentTheme;
        
        if (typeof component === 'string') {
            component = document.querySelector(component);
        }
        
        if (!component) return;

        // Add theme class to component
        component.classList.remove('theme-light', 'theme-dark');
        component.classList.add(`theme-${targetTheme}`);

        // Update data attribute
        component.setAttribute('data-theme', targetTheme);
    }

    // Create theme switcher component
    createThemeSwitcher(container) {
        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        switcher.innerHTML = `
            <div class="theme-switcher-label">Theme</div>
            <div class="theme-switcher-options">
                <button class="theme-option ${this.currentTheme === 'light' ? 'active' : ''}" 
                        data-theme="light" onclick="themeManager.setTheme('light')">
                    <i class="fas fa-sun"></i>
                    <span>Light</span>
                </button>
                <button class="theme-option ${this.currentTheme === 'dark' ? 'active' : ''}" 
                        data-theme="dark" onclick="themeManager.setTheme('dark')">
                    <i class="fas fa-moon"></i>
                    <span>Dark</span>
                </button>
                <button class="theme-option" onclick="themeManager.resetToSystemTheme()">
                    <i class="fas fa-desktop"></i>
                    <span>System</span>
                </button>
            </div>
        `;

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.appendChild(switcher);
        }

        return switcher;
    }

    // Add theme switcher styles
    addThemeSwitcherStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .theme-switcher {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                background-color: var(--bg-secondary);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-color);
            }

            .theme-switcher-label {
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--text-secondary);
            }

            .theme-switcher-options {
                display: flex;
                gap: 0.25rem;
            }

            .theme-option {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.375rem 0.75rem;
                border: none;
                background-color: transparent;
                color: var(--text-secondary);
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: var(--transition);
                font-size: 0.75rem;
            }

            .theme-option:hover {
                background-color: var(--bg-tertiary);
                color: var(--text-primary);
            }

            .theme-option.active {
                background-color: var(--primary-color);
                color: white;
            }

            .theme-option i {
                font-size: 0.875rem;
            }

            @media (max-width: 768px) {
                .theme-switcher-label {
                    display: none;
                }
                
                .theme-option span {
                    display: none;
                }
                
                .theme-option {
                    padding: 0.5rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Initialize theme switcher if needed
    initThemeSwitcher() {
        this.addThemeSwitcherStyles();
        
        // Add theme switcher to header if needed
        const headerActions = document.querySelector('.nav-actions');
        if (headerActions && !headerActions.querySelector('.theme-switcher')) {
            this.createThemeSwitcher(headerActions);
        }
    }

    // Listen for theme changes in other components
    onThemeChange(callback) {
        document.addEventListener('themeChanged', (e) => {
            callback(e.detail.theme);
        });
    }

    // Export theme configuration
    exportThemeConfig() {
        return {
            currentTheme: this.currentTheme,
            colors: this.getThemeColors(),
            palette: this.getThemePalette(),
            systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches
        };
    }

    // Import theme configuration
    importThemeConfig(config) {
        if (config.currentTheme) {
            this.setTheme(config.currentTheme);
        }
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Auto-initialize theme switcher on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Uncomment the next line if you want to auto-add the theme switcher
    // themeManager.initThemeSwitcher();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

// Global access
window.themeManager = themeManager;
