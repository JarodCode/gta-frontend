/**
 * Navbar Component
 * 
 * This module provides a consistent navigation bar that can be used across all pages
 * with proper authentication state handling.
 * 
 * @module components/navbar
 */

import { authService } from '../api/auth.js';

/**
 * Initialize the navbar with the correct authentication state
 * @param {string} currentPage - The current page identifier (e.g., 'home', 'games', 'profile')
 * @returns {Promise<void>}
 */
export async function initNavbar(currentPage = 'home') {
  const navbar = document.querySelector('header');
  if (!navbar) return;
  
  try {
    // Check if user is authenticated
    const isAuthenticated = await authService.isAuthenticated();
    
    // Update navbar content
    updateNavbarContent(navbar, isAuthenticated, currentPage);
    
    // Setup event listeners
    setupNavbarEventListeners(navbar, isAuthenticated);
    
    console.log('Navbar initialized successfully');
  } catch (error) {
    console.error('Error initializing navbar:', error);
    // Default to logged-out state if there's an error
    updateNavbarContent(navbar, false, currentPage);
  }
}

/**
 * Update the navbar content based on authentication state
 * @param {HTMLElement} navbar - The navbar element
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @param {string} currentPage - The current page identifier
 * @private
 */
function updateNavbarContent(navbar, isAuthenticated, currentPage) {
  const container = navbar.querySelector('.container') || navbar;
  
  container.innerHTML = `
    <div class="header-content">
      <div class="logo">
        <h1><a href="${getRelativePath(currentPage)}index.html">GameTrackr</a></h1>
      </div>
      <nav id="main-nav">
        <ul>
          <li><a href="${getRelativePath(currentPage)}index.html" class="${currentPage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="${getRelativePath(currentPage)}pages/games/list.html" class="${currentPage === 'games' ? 'active' : ''}">Games</a></li>
          ${isAuthenticated ? `
            <li><a href="${getRelativePath(currentPage)}pages/profile/index.html" class="${currentPage === 'profile' ? 'active' : ''}">Profile</a></li>
            <li><a href="#" id="logout-button">Logout</a></li>
          ` : `
            <li><a href="${getRelativePath(currentPage)}pages/login/index.html" class="${currentPage === 'login' ? 'active' : ''}">Login</a></li>
            <li><a href="${getRelativePath(currentPage)}pages/register/index.html" class="${currentPage === 'register' ? 'active' : ''}">Register</a></li>
          `}
        </ul>
      </nav>
      <div class="mobile-menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
}

/**
 * Setup event listeners for navbar interactions
 * @param {HTMLElement} navbar - The navbar element
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @private
 */
function setupNavbarEventListeners(navbar, isAuthenticated) {
  // Mobile menu toggle
  const mobileMenuToggle = navbar.querySelector('.mobile-menu-toggle');
  const mainNav = navbar.querySelector('#main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }
  
  // Logout button
  if (isAuthenticated) {
    const logoutButton = navbar.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await authService.logout();
          // Refresh the page after logout
          window.location.reload();
        } catch (error) {
          console.error('Logout failed:', error);
          alert('Failed to logout. Please try again.');
        }
      });
    }
  }
}

/**
 * Get the relative path to the root based on the current page
 * @param {string} currentPage - The current page identifier
 * @returns {string} The relative path prefix
 * @private
 */
function getRelativePath(currentPage) {
  // Home page is at the root
  if (currentPage === 'home') return '';
  
  // Login, register, profile pages are one level deep
  if (['login', 'register', 'profile'].includes(currentPage)) return '../';
  
  // Games pages are two levels deep
  if (['games'].includes(currentPage)) return '../../';
  
  // Default to current directory
  return '';
}

/**
 * Update the navbar when authentication state changes
 * This can be called after login/logout without page refresh
 * @returns {Promise<void>}
 */
export async function updateNavbarState() {
  // Determine current page from URL
  const path = window.location.pathname;
  let currentPage = 'home';
  
  if (path.includes('/pages/games/')) {
    currentPage = 'games';
  } else if (path.includes('/pages/login/')) {
    currentPage = 'login';
  } else if (path.includes('/pages/register/')) {
    currentPage = 'register';
  } else if (path.includes('/pages/profile/')) {
    currentPage = 'profile';
  }
  
  // Re-initialize navbar with current page
  await initNavbar(currentPage);
}

// Export the navbar module
export default {
  initNavbar,
  updateNavbarState
}; 