// Theme Toggle - Dark/Light Mode Switch
(function() {
  const STORAGE_KEY = 'portfolio-theme';

  // Get saved theme or detect system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply theme to document
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update toggle button icon
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // Dispatch event for terrain to respond
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // Icons
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  // Create and inject toggle button
  function createToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.innerHTML = getPreferredTheme() === 'dark' ? sunIcon : moonIcon;

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Insert into navbar - try multiple selectors for Quarto navbar
    const navbar = document.querySelector('.navbar-nav.navbar-nav-scroll.ms-auto') ||
                   document.querySelector('.navbar-nav.ms-auto') ||
                   document.querySelector('.navbar .navbar-nav:last-child');

    if (navbar) {
      const li = document.createElement('li');
      li.className = 'nav-item d-flex align-items-center';
      li.appendChild(btn);
      navbar.insertBefore(li, navbar.firstChild);
    } else {
      // Fallback: add to body as fixed button
      btn.classList.add('fixed-toggle');
      document.body.appendChild(btn);
    }
  }

  // Initialize
  function init() {
    // Apply theme immediately to prevent flash
    setTheme(getPreferredTheme());
    createToggleButton();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Apply theme before DOM loads to prevent flash
  document.documentElement.setAttribute('data-theme', getPreferredTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
