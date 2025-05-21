// auth.js - Client-side authentication handling with proper exports

// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';
const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  me: `${API_BASE_URL}/auth/me`,
  logout: `${API_BASE_URL}/auth/logout`
};

// Store auth token in localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Utility function for API calls
async function apiCall(url, method = 'GET', data = null) {
  console.log(`Making ${method} request to ${url}`);
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Add auth token if available
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
    credentials: 'include', // Important for cookies
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    console.log('Fetch options:', options);
    const response = await fetch(url, options);
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      
      try {
        // Try to parse as JSON
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || `Server error: ${response.status}`);
      } catch (e) {
        // If not JSON, use text
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call error to ${url}:`, error);
    throw error;
  }
}

// Register new user
async function register(username, email, password) {
  try {
    console.log('Registering user:', username);
    const response = await apiCall(AUTH_ENDPOINTS.register, 'POST', {
      username,
      email,
      password
    });
    
    console.log('Registration response:', response);
    
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login user
async function login(username, password) {
  try {
    console.log('Logging in user:', username);
    const response = await apiCall(AUTH_ENDPOINTS.login, 'POST', {
      username,
      password
    });
    
    console.log('Login response:', response);
    
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Get current authenticated user
async function getCurrentUser() {
  // First try local storage
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
  }
  
  // If no stored user or invalid, try to fetch from API
  try {
    const response = await apiCall(AUTH_ENDPOINTS.me);
    
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      return response.user;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Logout user
async function logout() {
  try {
    await apiCall(AUTH_ENDPOINTS.logout, 'POST');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always clear local storage on logout attempt
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

// Check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

// Initialize auth functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Auth system initialized');
  
  // Setup login form handler if exists
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const errorMessage = document.getElementById('login-error');
      
      if (errorMessage) {
        errorMessage.textContent = '';
      }
      
      try {
        const result = await login(usernameInput.value, passwordInput.value);
        console.log('Login successful:', result);
        window.location.href = '/dashboard.html'; // Redirect after login
      } catch (error) {
        console.error('Login form error:', error);
        if (errorMessage) {
          errorMessage.textContent = error.message || 'Login failed. Please try again.';
        }
      }
    });
  }
  
  // Setup register form handler if exists
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const errorMessage = document.getElementById('register-error');
      
      if (errorMessage) {
        errorMessage.textContent = '';
      }
      
      try {
        const result = await register(
          usernameInput.value,
          emailInput.value,
          passwordInput.value
        );
        console.log('Registration successful:', result);
        window.location.href = '/dashboard.html'; // Redirect after registration
      } catch (error) {
        console.error('Registration form error:', error);
        if (errorMessage) {
          errorMessage.textContent = error.message || 'Registration failed. Please try again.';
        }
      }
    });
  }
});

// Option 1: Export for ES modules
export {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

// Option 2: Export for CommonJS/global use
window.Auth = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

// Option 3: Export as default for ES modules
export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};