// Register page functionality
import { register, getCurrentUser } from './mock-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const registerError = document.getElementById('register-error');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous error messages
      registerError.textContent = '';
      registerError.style.display = 'none';
      
      // Get form data
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Basic validation
      if (!username || !email || !password || !confirmPassword) {
        registerError.textContent = 'Please fill in all fields';
        registerError.style.display = 'block';
        return;
      }
      
      if (password !== confirmPassword) {
        registerError.textContent = 'Passwords do not match';
        registerError.style.display = 'block';
        return;
      }
      
      if (password.length < 6) {
        registerError.textContent = 'Password must be at least 6 characters';
        registerError.style.display = 'block';
        return;
      }
      
      try {
        console.log('Attempting to register user:', username);
        
        // Use our mock auth service
        await register({ username, email, password });
        
        console.log('Registration successful!');
        
        // Redirect to home on successful registration
        window.location.href = '/';
      } catch (error) {
        console.error('Registration error:', error);
        registerError.textContent = error.message || 'An error occurred during registration. Please try again.';
        registerError.style.display = 'block';
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