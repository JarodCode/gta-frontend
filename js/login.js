// Login page functionality
import { login, getCurrentUser } from './mock-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous error messages
      loginError.textContent = '';
      loginError.style.display = 'none';
      
      // Get form data
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      // Basic validation
      if (!username || !password) {
        loginError.textContent = 'Please enter both username and password';
        loginError.style.display = 'block';
        return;
      }
      
      try {
        console.log('Attempting to log in with username:', username);
        
        // Use our mock auth service instead of server fetch
        await login({ username, password });
        
        console.log('Login successful!');
        
        // Redirect to home on successful login
        window.location.href = '/';
      } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = error.message || 'An error occurred during login. Please try again.';
        loginError.style.display = 'block';
      }
    });
  }
  
  // Function to check if user is already logged in
  const checkAuthStatus = () => {
    const user = getCurrentUser();
    
    if (user) {
      // If user is already logged in, redirect to home
      window.location.href = '/';
    }
  };
  
  // Check authentication status when page loads
  checkAuthStatus();
}); 