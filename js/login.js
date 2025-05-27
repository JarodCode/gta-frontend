/**
 * Login page functionality
 * 
 * Handles user login with a modern class-based approach
 */
import { authService } from './api/auth.js';
import { initNavbar } from './components/navbar.js';

/**
 * Login Handler Class
 * A modern approach to handle user authentication
 */
class Login {
  /**
   * Constructor - initializes the login form
   */
  constructor() {
    this.form = document.getElementById('login-form');
    this.errorDisplay = document.getElementById('login-error');
    this.usernameInput = document.getElementById('username');
    this.passwordInput = document.getElementById('password');
    this.submitButton = this.form ? this.form.querySelector('button[type="submit"]') : null;
    this.localLoginButton = document.getElementById('local-login-button');
    
    this.init();
    
    // Initialize navbar
    this.initializeNavbar();
  }
  
  /**
   * Initialize the login handler
   */
  init() {
    console.log('Initializing Login Handler');
    
    if (!this.form) {
      console.error('Login form not found in the DOM');
      return;
    }
    
    // Don't check auth status on login page
    // this.checkAuthStatus();
    
    // Attach event listeners
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    if (this.localLoginButton) {
      this.localLoginButton.addEventListener('click', this.handleLocalLogin.bind(this));
    }
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  async handleSubmit(e) {
<<<<<<< HEAD
    e.preventDefault();
    
    // Clear previous errors
    this.clearErrors();
    
    // Get form data
=======
      e.preventDefault();
      
    // Clear previous errors
    this.clearErrors();
      
      // Get form data
>>>>>>> dev
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;
    
    // Validate inputs
    if (!this.validateInputs(username, password)) {
<<<<<<< HEAD
      return;
    }
    
    try {
=======
        return;
      }
      
      try {
>>>>>>> dev
      // Show loading state
      this.setLoading(true);
      
      // Prepare user credentials
      const credentials = { username, password };
      
      console.log('Attempting login for user:', username);
      
      // Make the API request
      const response = await authService.login(credentials);
      
      console.log('Login successful:', response);
      
      // Show success message and redirect
      this.showSuccess();
<<<<<<< HEAD
    } catch (error) {
=======
      } catch (error) {
>>>>>>> dev
      console.error('Login failed:', error);
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }
  
  /**
   * Validate user inputs
   * @param {string} username - User entered username
   * @param {string} password - User entered password
   * @returns {boolean} Whether the inputs are valid
   */
  validateInputs(username, password) {
    if (!username) {
      this.showError('Please enter a username');
      return false;
    }
    
    if (!password) {
      this.showError('Please enter a password');
      return false;
    }
    
    return true;
  }
  
  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (this.errorDisplay) {
      this.errorDisplay.textContent = message;
      this.errorDisplay.style.display = 'block';
    }
  }
  
  /**
   * Clear all error messages
   */
  clearErrors() {
    if (this.errorDisplay) {
      this.errorDisplay.textContent = '';
      this.errorDisplay.style.display = 'none';
    }
  }
  
  /**
   * Set loading state
   * @param {boolean} isLoading - Whether the form is in loading state
   */
  setLoading(isLoading) {
    if (this.submitButton) {
      this.submitButton.disabled = isLoading;
      this.submitButton.textContent = isLoading ? 'Logging in...' : 'Login';
    }
  }
  
  /**
   * Handle login error
   * @param {Error} error - The error that occurred
   */
  handleError(error) {
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.status === 401 || (error.message && error.message.includes('Invalid'))) {
      errorMessage = 'Invalid username or password. Please try again.';
    } else if (error.status === 400) {
      errorMessage = error.message || 'Invalid login credentials';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.showError(errorMessage);
  }
  
  /**
   * Show success message and redirect
   */
  showSuccess() {
    if (this.form) {
      this.form.innerHTML = `
        <div class="success-message">
          <h3>Login Successful!</h3>
          <p>You have been logged in successfully.</p>
          <p>Redirecting to home page...</p>
        </div>
      `;
      
      // Redirect after a delay
      setTimeout(() => {
        window.location.href = '../..';
      }, 1500);
    }
  }
  
  /**
   * Check if user is already authenticated
   * Note: We're not using this on the login page to prevent redirect loops
   */
  async checkAuthStatus() {
    try {
      console.log('Checking authentication status...');
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        console.log('User is already logged in, but staying on login page');
        // Removed automatic redirect to allow viewing the login page
        // window.location.href = '../..';
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // If there's an error, we'll just stay on the login page
    }
  }
  
  /**
   * Initialize the navbar component
   */
  async initializeNavbar() {
    try {
      await initNavbar('login');
    } catch (error) {
      console.error('Failed to initialize navbar:', error);
      // Continue with rest of the login functionality
    }
  }

  /**
   * Handle local login button click
   */
  async handleLocalLogin() {
    // Clear previous errors
    this.clearErrors();
    
    // Get form data
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;
    
    // Validate inputs
    if (!this.validateInputs(username, password)) {
      return;
    }
    
    try {
      // Show loading state
      this.setLoading(true);
      
      // Prepare login data
      const loginData = {
        username,
        password,
      };
      
      console.log('Sending local login request:', username);
      
      // Make the API request
      const response = await authService.loginLocal(loginData);
      
      console.log('Local login successful:', response);
      
      // Show success message and redirect
      this.showLocalSuccess();
    } catch (error) {
      console.error('Local login failed:', error);
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Show local login success message and redirect
   */
  showLocalSuccess() {
    if (this.errorDisplay) {
      this.errorDisplay.textContent = 'Local login successful! Redirecting...';
      this.errorDisplay.style.color = 'green';
      this.errorDisplay.style.display = 'block';
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  }
}

// Initialize login when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Login();
}); 