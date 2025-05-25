// Add debugging for imports to see if they're loading correctly
window.addEventListener('error', function(event) {
    console.error('Script error detected:', event.filename, event.message);
});

console.log('Loading app modules...');
// Import modules - imports must be at the top level of a module script
import { fetchGames, transformGameData } from './api.js';
import { authService } from './api/auth.js';
import { initNavbar, updateNavbarState } from './components/navbar.js';
// import { getGamesSortedByUserRating } from './reviews.js';

console.log('App modules loaded successfully');

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing application...');
    
    // Initialize navbar with authentication state
    await initNavbar('home');
    
    // Update auth buttons visibility based on login state
    await updateAuthButtonsVisibility();
    
    // Listen for auth state changes
    authService.onAuthStateChange(user => {
        updateAuthButtonsVisibility(!!user);
    });
    
    // Setup search functionality
    setupSearch();
    
    // Setup CTA signup button
    setupCTAButton();
    
    // Setup event listeners for login/logout buttons
    setupAuthButtons();
    
    console.log('Application initialized successfully');
});

/**
 * Update the visibility of authentication buttons based on login state
 * @param {boolean} [isAuthenticated=null] - Whether the user is authenticated
 * @returns {Promise<void>}
 */
async function updateAuthButtonsVisibility(isAuthenticated = null) {
    // If authentication state is not provided, check it
    if (isAuthenticated === null) {
        isAuthenticated = await authService.isAuthenticated();
    }
    
    // Get auth buttons elements
    const heroAuthButtons = document.getElementById('hero-auth-buttons');
    const ctaLoginButton = document.getElementById('cta-login-button');
    const ctaSignupButton = document.getElementById('cta-signup-button');
    
    // Update visibility based on authentication state
    if (heroAuthButtons) {
        heroAuthButtons.style.display = isAuthenticated ? 'none' : 'flex';
    }
    
    if (ctaLoginButton) {
        ctaLoginButton.style.display = isAuthenticated ? 'none' : 'inline-block';
    }
    
    if (ctaSignupButton) {
        ctaSignupButton.style.display = isAuthenticated ? 'none' : 'inline-block';
    }
    
    // Update CTA section text if authenticated
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection && isAuthenticated) {
        const ctaContent = ctaSection.querySelector('.cta-content');
        if (ctaContent) {
            ctaContent.innerHTML = `
                <h2>Welcome to GameTrackr!</h2>
                <p>You're now part of our gaming community. Start tracking your gaming journey by rating and reviewing games.</p>
                <div class="button-group">
                    <a href="pages/games/list.html" class="btn btn-lg btn-primary">Explore Games</a>
                </div>
            `;
        }
    }
}

// Setup search functionality
function setupSearch() {
    // Event listener for the search button
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    
    // Event listener for the search input (search on Enter key)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

// Handle search functionality
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `pages/games/list.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }

// Setup CTA signup button
function setupCTAButton() {
    const ctaSignupButton = document.getElementById('cta-signup-button');
    if (ctaSignupButton) {
        ctaSignupButton.addEventListener('click', () => {
            window.location.href = 'pages/register/';
        });
    }
}

// Setup authentication buttons
function setupAuthButtons() {
    // Handle login button
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = 'pages/login/';
        });
    }
    
    // Handle signup button
    const signupButton = document.getElementById('signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', () => {
            window.location.href = 'pages/register/';
        });
    }
    
    // Handle logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            authService.logout();
            updateAuthButtonsVisibility(false);
        });
    }
    
    // Handle modal close buttons
    const closeButtons = document.querySelectorAll('.close-button');
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });
    }
    
    // Handle links between login and signup modals
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
            const signupModal = document.getElementById('signup-modal');
            const loginModal = document.getElementById('login-modal');
            if (signupModal) signupModal.style.display = 'none';
            if (loginModal) loginModal.style.display = 'flex';
        });
    }
    
    const signupLink = document.getElementById('signup-link');
    if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            if (loginModal) loginModal.style.display = 'none';
            if (signupModal) signupModal.style.display = 'flex';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Handle hash links for login/signup
    handleHashLinks();
}

// Handle hash links for login/signup
function handleHashLinks() {
    if (window.location.hash) {
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        
        if (window.location.hash === '#login' && loginModal) {
            loginModal.style.display = 'block';
        } else if (window.location.hash === '#signup' && signupModal) {
            signupModal.style.display = 'block';
        }
        // Clear the hash after processing
        history.replaceState(null, null, ' ');
    }
}

/**
 * Main JavaScript file for the GameRevu homepage
 */

class HomePage {
  constructor() {
    this.gamesContainer = document.getElementById('games-container');
    this.errorContainer = document.getElementById('error-container');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.searchForm = document.getElementById('search-form');
    this.searchInput = document.getElementById('search-input');
    this.filterButtons = document.querySelectorAll('.filter-button');
    this.sortSelect = document.getElementById('sort-select');
    
    this.currentFilter = 'all';
    this.currentSort = 'popular';
    this.searchQuery = '';
  }

  init() {
    this.loadGames();
    
    // Add event listeners
    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
    }
    
    if (this.filterButtons) {
      this.filterButtons.forEach(button => {
        button.addEventListener('click', () => this.handleFilter(button.dataset.filter));
      });
    }
    
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => this.handleSort());
    }
    
    // Check authentication status to update UI
    this.updateAuthButtonsVisibility();
  }

  async loadGames() {
    this.setLoading(true);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (this.searchQuery) queryParams.append('search', this.searchQuery);
      if (this.currentFilter !== 'all') queryParams.append('filter', this.currentFilter);
      if (this.currentSort) queryParams.append('sort', this.currentSort);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`/api/games${queryString}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load games: ${response.statusText}`);
      }
      
      const games = await response.json();
      this.renderGames(games);
        } catch (error) {
      console.error('Error loading games:', error);
      this.showError(`Failed to load games: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  renderGames(games) {
    if (!this.gamesContainer) return;
    
    if (!games || games.length === 0) {
      this.gamesContainer.innerHTML = `
        <div class="no-results">
          <p>No games found. Try adjusting your search or filters.</p>
        </div>
      `;
      return;
    }
    
    const gamesHTML = games.map(game => `
      <div class="game-card">
        <a href="/pages/game/index.html?id=${game.id}" class="game-link">
          <div class="game-cover">
            <img src="${game.coverUrl || '/images/fallback-logo.png'}" alt="${game.title}" loading="lazy">
            ${game.averageRating ? `<div class="game-rating">${game.averageRating.toFixed(1)}</div>` : ''}
          </div>
          <div class="game-info">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-release-date">${game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'Unknown'}</p>
            ${game.developer ? `<p class="game-developer">${game.developer}</p>` : ''}
          </div>
        </a>
      </div>
    `).join('');
    
    this.gamesContainer.innerHTML = gamesHTML;
  }

  handleSearch(e) {
    e.preventDefault();
    this.searchQuery = this.searchInput.value.trim();
    this.loadGames();
  }

  handleFilter(filter) {
    this.currentFilter = filter;
    
    // Update active button
    if (this.filterButtons) {
      this.filterButtons.forEach(button => {
        if (button.dataset.filter === filter) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
    
    this.loadGames();
  }

  handleSort() {
    this.currentSort = this.sortSelect.value;
    this.loadGames();
  }

  showError(message) {
    if (!this.errorContainer) return;
    
    this.errorContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    this.errorContainer.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      this.errorContainer.style.display = 'none';
    }, 5000);
  }

  setLoading(isLoading) {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
    
    if (this.gamesContainer) {
      this.gamesContainer.style.opacity = isLoading ? '0.5' : '1';
    }
  }

  async updateAuthButtonsVisibility() {
    try {
      const isLoggedIn = await authService.isAuthenticated();
      
      const loginBtn = document.getElementById('login-button');
      const registerBtn = document.getElementById('register-button');
      const profileBtn = document.getElementById('profile-button');
      const logoutBtn = document.getElementById('logout-button');
      
      if (isLoggedIn) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
      } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (profileBtn) profileBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
      }
        } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  }
}

// Initialize the homepage when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const homePage = new HomePage();
  homePage.init();
});