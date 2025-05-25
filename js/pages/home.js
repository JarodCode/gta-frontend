/**
 * Home Page Module
 * 
 * This module handles the functionality for the home page:
 * - Featured games section
 * - Top rated games section
 * - Search functionality
 * - Authentication UI
 * 
 * @module pages/home
 */

import { authService } from '../api/auth.js';
import { gamesService } from '../api/games.js';

// DOM elements
let featuredGamesContainer;
let topRatedGamesContainer;
let featuredGamesLoading;
let topRatedGamesLoading;
let searchInput;
let searchButton;
let loginButton;
let signupButton;
let logoutButton;
let userMenu;
let usernameDisplay;
let loginModal;
let signupModal;
let loginForm;
let signupForm;
let loginError;
let signupError;
let ctaSignupButton;

/**
 * Initialize the home page
 * @function init
 */
export function init() {
  // Get DOM elements
  featuredGamesContainer = document.getElementById('featured-games-container');
  topRatedGamesContainer = document.getElementById('top-rated-games-container');
  featuredGamesLoading = document.getElementById('featured-games-loading');
  topRatedGamesLoading = document.getElementById('top-rated-games-loading');
  searchInput = document.getElementById('search-input');
  searchButton = document.getElementById('search-button');
  loginButton = document.getElementById('login-button');
  signupButton = document.getElementById('signup-button');
  logoutButton = document.getElementById('logout-button');
  userMenu = document.getElementById('user-menu');
  usernameDisplay = document.getElementById('username');
  loginModal = document.getElementById('login-modal');
  signupModal = document.getElementById('signup-modal');
  loginForm = document.getElementById('login-form');
  signupForm = document.getElementById('signup-form');
  loginError = document.getElementById('login-error');
  signupError = document.getElementById('signup-error');
  ctaSignupButton = document.getElementById('cta-signup-button');

  // Set up event listeners
  setupEventListeners();
  
  // Check login status and update UI
  checkLoginStatus();
  
  // Load featured and top rated games
  loadFeaturedGames();
}

/**
 * Set up event listeners for the page
 * @private
 * @function setupEventListeners
 */
function setupEventListeners() {
  // Search functionality
  if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  // Login functionality
  if (loginButton) {
    loginButton.addEventListener('click', () => openModal(loginModal));
  }
  
  // Signup functionality
  if (signupButton) {
    signupButton.addEventListener('click', () => openModal(signupModal));
  }
  if (ctaSignupButton) {
    ctaSignupButton.addEventListener('click', () => openModal(signupModal));
  }
  
  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
  
  // Close modal buttons
  document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
      closeModal(loginModal);
      closeModal(signupModal);
    });
  });
  
  // Modal link switches
  const signupLink = document.getElementById('signup-link');
  if (signupLink) {
    signupLink.addEventListener('click', event => {
      event.preventDefault();
      closeModal(loginModal);
      openModal(signupModal);
    });
  }
  
  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    loginLink.addEventListener('click', event => {
      event.preventDefault();
      closeModal(signupModal);
      openModal(loginModal);
    });
  }
  
  // Form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', event => {
    if (event.target === loginModal) {
      closeModal(loginModal);
    }
    if (event.target === signupModal) {
      closeModal(signupModal);
    }
  });
  
  // Auth state change listener
  authService.onAuthStateChange(user => {
    updateAuthUI(user);
  });
}

/**
 * Check login status and update UI
 * @async
 * @private
 * @function checkLoginStatus
 */
async function checkLoginStatus() {
  try {
    const user = await authService.getCurrentUser();
    updateAuthUI(user);
  } catch (error) {
    console.error('Error checking login status:', error);
    // Show logged out state on error
    updateAuthUI(null);
  }
}

/**
 * Update the UI based on authentication state
 * @private
 * @function updateAuthUI
 * @param {Object|null} user - The current user or null if not logged in
 */
function updateAuthUI(user) {
  if (!loginButton || !userMenu) {
    return; // Elements not found, might be on a different page
  }

  if (user) {
    // User is logged in
    loginButton.classList.add('d-none');
    signupButton.classList.add('d-none');
    userMenu.classList.remove('d-none');
    usernameDisplay.textContent = user.username;
  } else {
    // User is logged out
    loginButton.classList.remove('d-none');
    signupButton.classList.remove('d-none');
    userMenu.classList.add('d-none');
  }
}

/**
 * Load featured and top rated games
 * @async
 * @private
 * @function loadFeaturedGames
 */
async function loadFeaturedGames() {
  try {
    // Show loading indicators
    if (featuredGamesLoading) featuredGamesLoading.classList.remove('d-none');
    if (topRatedGamesLoading) topRatedGamesLoading.classList.remove('d-none');
    
    // Get popular games for featured section
    const popularResponse = await gamesService.getPopularGames({ limit: 5 });
    
    // Get top rated games
    const topRatedResponse = await gamesService.getPopularGames({
      limit: 5,
      ordering: '-avg_rating'
    });
    
    // Display games - handle both API response format and hardcoded fallback format
    if (featuredGamesContainer) {
      const popularGames = popularResponse?.games || popularResponse?.results || [];
      displayGames(popularGames, featuredGamesContainer);
      if (featuredGamesLoading) featuredGamesLoading.classList.add('d-none');
    }
    
    if (topRatedGamesContainer) {
      const topRatedGames = topRatedResponse?.games || topRatedResponse?.results || [];
      displayGames(topRatedGames, topRatedGamesContainer);
      if (topRatedGamesLoading) topRatedGamesLoading.classList.add('d-none');
    }
  } catch (error) {
    console.error('Error loading featured games:', error);
    
    // Show error message
    if (featuredGamesLoading) {
      featuredGamesLoading.textContent = 'Error loading games. Please try again later.';
    }
    if (topRatedGamesLoading) {
      topRatedGamesLoading.textContent = 'Error loading games. Please try again later.';
    }
  }
}

/**
 * Display games in a container
 * @private
 * @function displayGames
 * @param {Array} games - Array of game objects
 * @param {HTMLElement} container - Container element to display games in
 */
function displayGames(games, container) {
  container.innerHTML = '';
  
  if (!games || games.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">No games available</p>';
    return;
  }
  
  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    
    // Safely access game properties with fallbacks
    const title = game.title || game.name || 'Unknown Game';
    const genre = game.genre || 'Uncategorized';
    const thumbnail = game.cover_url || game.background_image || './assets/images/placeholder.jpg';
    const description = game.description?.substring(0, 100) + '...' || '';
    const gameId = game.id || 0;
    const rating = game.avg_rating || 0;
    const ratingCount = game.review_count || 0;
    
    gameCard.innerHTML = `
      <div class="game-thumbnail">
        <img src="${thumbnail}" alt="${title}" onerror="this.src='./assets/images/placeholder.jpg'">
      </div>
      <div class="game-info">
        <h3>${title}</h3>
        <div class="game-meta">
          <span class="game-genre">${genre}</span>
          <div class="stars">
            ${getStarRating(rating)}
            <span class="rating-count">(${ratingCount})</span>
          </div>
        </div>
        <p class="game-description">${description}</p>
        <a href="./pages/games/index.html?id=${gameId}" class="button button-sm">View Game</a>
      </div>
    `;
    
    container.appendChild(gameCard);
  });
}

/**
 * Get star rating HTML based on rating value
 * @private
 * @function getStarRating
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star rating HTML
 */
function getStarRating(rating) {
  const roundedRating = Math.round(rating * 2) / 2;
  let starsHtml = '';
  
  for (let i = 1; i <= 5; i++) {
    if (roundedRating >= i) {
      starsHtml += '<span class="star-full">★</span>';
    } else if (roundedRating === i - 0.5) {
      starsHtml += '<span class="star-half">★</span>';
    } else {
      starsHtml += '<span class="star-empty">☆</span>';
    }
  }
  
  return starsHtml;
}

/**
 * Handle search form submission
 * @private
 * @function handleSearch
 */
function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `./pages/games/search.html?q=${encodeURIComponent(query)}`;
  }
}

/**
 * Handle login form submission
 * @async
 * @private
 * @function handleLogin
 * @param {Event} event - Form submission event
 */
async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  if (!username || !password) {
    loginError.textContent = 'Please enter username and password';
    loginError.classList.remove('d-none');
    return;
  }
  
  try {
    await authService.login({ username, password });
    closeModal(loginModal);
    loginForm.reset();
    loginError.classList.add('d-none');
  } catch (error) {
    loginError.textContent = error.message || 'Login failed. Please check your credentials.';
    loginError.classList.remove('d-none');
  }
}

/**
 * Handle signup form submission
 * @async
 * @private
 * @function handleSignup
 * @param {Event} event - Form submission event
 */
async function handleSignup(event) {
  event.preventDefault();
  
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Validate inputs
  if (!username || !email || !password || !confirmPassword) {
    signupError.textContent = 'Please fill out all fields';
    signupError.classList.remove('d-none');
    return;
  }
  
  if (password !== confirmPassword) {
    signupError.textContent = 'Passwords do not match';
    signupError.classList.remove('d-none');
    return;
  }
  
  try {
    await authService.register({ username, email, password });
    closeModal(signupModal);
    signupForm.reset();
    signupError.classList.add('d-none');
  } catch (error) {
    signupError.textContent = error.message || 'Registration failed. Please try again.';
    signupError.classList.remove('d-none');
  }
}

/**
 * Handle logout button click
 * @async
 * @private
 * @function handleLogout
 */
async function handleLogout() {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Open a modal
 * @private
 * @function openModal
 * @param {HTMLElement} modal - Modal element to open
 */
function openModal(modal) {
  if (modal) {
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
  }
}

/**
 * Close a modal
 * @private
 * @function closeModal
 * @param {HTMLElement} modal - Modal element to close
 */
function closeModal(modal) {
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}

// Export the module
export default {
  init
}; 