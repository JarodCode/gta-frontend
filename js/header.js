/**
 * Header functionality
 * 
 * Handles user authentication status and header interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dropdown functionality
  initializeDropdowns();
  
  // Check authentication status and update UI
  checkAuthStatus();
});

/**
 * Initialize dropdown functionality in the header
 */
function initializeDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = toggle.nextElementSibling;
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu !== dropdown) {
          menu.classList.remove('show');
        }
      });
      
      // Toggle current dropdown
      dropdown.classList.toggle('show');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  });
}

/**
 * Check if user is authenticated and update UI accordingly
 */
async function checkAuthStatus() {
  try {
    // Get auth elements
    const authLinksContainer = document.getElementById('auth-links');
    const userMenuContainer = document.getElementById('user-menu');
    
    if (!authLinksContainer || !userMenuContainer) {
      console.warn('Auth containers not found in header');
      return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // User is logged in, show user menu
      const username = localStorage.getItem('username');
      
      if (username) {
        const userNameElement = userMenuContainer.querySelector('.user-name');
        if (userNameElement) {
          userNameElement.textContent = username;
        }
        
        authLinksContainer.style.display = 'none';
        userMenuContainer.style.display = 'flex';
      } else {
        // Username not found, show login links
        authLinksContainer.style.display = 'flex';
        userMenuContainer.style.display = 'none';
      }
    } else {
      // User is not logged in, show login links
      authLinksContainer.style.display = 'flex';
      userMenuContainer.style.display = 'none';
    }
    
    // Add logout functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        // Redirect to home page
        window.location.href = '/';
      });
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
  }
} 