/**
 * Register page functionality
 * 
 * Handles user registration with a modern class-based approach
 */
import { authService } from './api/auth.js';
import { initNavbar } from './components/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Register page loaded');
  
  try {
    // Initialize the navbar
    await initNavbar('register');
  } catch (error) {
    console.error('Failed to initialize navbar:', error);
    // Continue with the rest of the page initialization
  }
  
  // Initialize registration when the DOM is ready
  new Registration();
});

/**
 * Registration Handler Class
 * A modern approach to handle user registration
 */
class Registration {
  /**
   * Constructor - initializes the registration form
   */
  constructor() {
    this.form = document.getElementById('register-form');
    this.errorDisplay = document.getElementById('register-error');
    this.usernameInput = document.getElementById('username');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.confirmPasswordInput = document.getElementById('confirm-password');
    this.submitButton = this.form ? this.form.querySelector('button[type="submit"]') : null;
    this.localRegisterButton = document.getElementById('local-account-button');
    
    this.init();
    
    // Initialize navbar
    this.initializeNavbar();
  }
  
  /**
   * Initialize the registration handler
   */
  init() {
    console.log('Initializing Registration Handler');
    
    if (!this.form) {
      console.error('Registration form not found in the DOM');
      return;
    }
    
    // Don't check auth status on register page
    // this.checkAuthStatus();
    
    // Attach event listeners
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    if (this.localRegisterButton) {
      this.localRegisterButton.addEventListener('click', this.handleLocalRegister.bind(this));
    }
  }
  
  /**
   * Initialize the navbar component
   */
  async initializeNavbar() {
    try {
      await initNavbar('register');
    } catch (error) {
      console.error('Failed to initialize navbar:', error);
      // Continue with rest of the registration functionality
    }
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    this.clearErrors();
    
    // Get form data
    const username = this.usernameInput.value.trim();
    const email = this.emailInput?.value?.trim();
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;
    
    // Validate inputs
    if (!this.validateInputs(username, password, confirmPassword)) {
      return;
    }
    
    try {
      // Show loading state
      this.setLoading(true);
      
      // Prepare user data
      const userData = {
        username,
        email,
        password,
      };
      
      console.log('Sending registration request:', username);
      
      // Make the API request
      const response = await authService.register(userData);
      
      console.log('Registration successful:', response);
      
      // Show success message and redirect
      this.showSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }
  
  /**
   * Handle local register button click
   */
  async handleLocalRegister() {
    // Clear previous errors
    this.clearErrors();
    
    // Get form data
    const username = this.usernameInput.value.trim();
    const email = this.emailInput?.value?.trim();
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;
    
    // Validate inputs
    if (!this.validateInputs(username, password, confirmPassword)) {
      return;
    }
    
    try {
      // Show loading state
      this.setLoading(true);
      
      // Prepare user data
      const userData = {
        username,
        email,
        password,
      };
      
      console.log('Sending local registration request:', username);
      
      // Make the API request
      const response = await authService.registerLocal(userData);
      
      console.log('Local registration successful:', response);
      
      // Show success message and redirect
      this.showLocalSuccess();
    } catch (error) {
      console.error('Local registration failed:', error);
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }
  
  /**
   * Validate user inputs
   * @param {string} username - User entered username
   * @param {string} password - User entered password
   * @param {string} confirmPassword - User entered confirmation password
   * @returns {boolean} Whether the inputs are valid
   */
  validateInputs(username, password, confirmPassword) {
    if (!username) {
      this.showError('Please enter a username');
      return false;
    }
    
    if (!password) {
      this.showError('Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      this.showError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      this.showError('Passwords do not match');
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
      this.submitButton.textContent = isLoading ? 'Creating account...' : 'Register';
    }
  }
  
  /**
   * Handle registration error
   * @param {Error} error - The error that occurred
   */
  handleError(error) {
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error instanceof Error) {
      console.error('Registration error details:', error);
      
      // Check for network errors (status code 0)
      if (error.status === 0) {
        errorMessage = 'Cannot connect to the server. Please try the "Create Local Account" option instead.';
      } 
      // Check for validation errors (400)
      else if (error.status === 400) {
        errorMessage = error.message || 'Invalid registration data';
      } 
      // Check for conflict errors (409)
      else if (error.status === 409 || (error.message && error.message.includes('already taken'))) {
        errorMessage = 'Username or email is already taken. Please choose a different one.';
      } 
      // Check if we have a specific error message to display
      else if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    } else if (typeof error === 'object') {
      // Try to extract information from other error formats
      errorMessage = error.message || error.error || JSON.stringify(error);
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
          <h3>Registration Successful!</h3>
          <p>Your account has been created successfully.</p>
          <p>Redirecting to home page...</p>
        </div>
      `;
      
      // Redirect after a delay
      setTimeout(() => {
        window.location.href = '../..';
      }, 2000);
    }
  }
  
  /**
   * Show local registration success message and redirect
   */
  showLocalSuccess() {
    if (this.errorDisplay) {
      this.errorDisplay.textContent = 'Local account created successfully! Redirecting to login page...';
      this.errorDisplay.style.color = 'green';
      this.errorDisplay.style.display = 'block';
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/pages/login/';
      }, 1500);
    }
  }
  
  /**
   * Check if user is already authenticated
   * Note: We're not using this on the register page to prevent redirect loops
   */
  async checkAuthStatus() {
    try {
      console.log('Checking authentication status...');
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        console.log('User is already logged in, but staying on register page');
        // Removed automatic redirect to allow viewing the register page
        // window.location.href = '../..';
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // If there's an error, we'll just stay on the register page
    }
  }
} 