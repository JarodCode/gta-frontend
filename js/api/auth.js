/**
 * Authentication API Module
 * 
 * This module provides functions for user authentication operations:
 * - User registration
 * - Login/logout
 * - Getting current user info
 * - Managing authentication state
 * 
 * @module api/auth
 */

import { apiClient } from './client.js';

/**
 * Authentication endpoints
 * @constant {Object} AUTH_ENDPOINTS - API endpoints for auth operations
 */
const AUTH_ENDPOINTS = {
  register: '/api/users/register',
  login: '/api/users/login',
  logout: '/api/users/logout',
  me: '/api/users/me'
};

/**
 * Cache for current user to reduce API calls
 * @type {Object}
 */
let currentUserCache = {
  user: null,
  timestamp: 0,
  expiresIn: 60000 // 1 minute
};

/**
 * Event listeners for auth state changes
 * @type {Array<Function>}
 */
const authStateListeners = [];

/**
 * Store authentication token in localStorage
 * @private
 * @function storeAuthToken
 * @param {string} token - JWT token
 */
function storeAuthToken(token) {
  if (token) {
    localStorage.setItem('authToken', token);
  }
}

/**
 * Get stored authentication token
 * @private
 * @function getAuthToken
 * @returns {string|null} Stored JWT token or null if not found
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Clear authentication token
 * @private
 * @function clearAuthToken
 */
function clearAuthToken() {
  localStorage.removeItem('authToken');
}

/**
 * Register a new user
 * @async
 * @function register
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} [userData.email] - Email address (optional)
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} Registration response with user data
 */
export async function register({ username, email, password }) {
  try {
    // If email is not provided, use username as email
    const userEmail = email || `${username}@example.com`;
    
    console.log('Sending register request to server:', { username, email: userEmail });
    
    const response = await apiClient.post(AUTH_ENDPOINTS.register, {
      username,
      email: userEmail,
      password
    });
    
    console.log('Register response:', response);
    
    // Store JWT token in localStorage
    if (response.token) {
      storeAuthToken(response.token);
    }
    
    // Store user in localStorage as a fallback
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    
    // Clear the user cache to force a refresh
    clearUserCache();
    
    // Notify listeners of auth state change
    notifyAuthStateChange();
    
    return response;
  } catch (error) {
    console.error('Registration error details:', error);
    
    // If the server is unreachable, provide a helpful message
    if (error.status === 0) {
      throw new Error('Cannot connect to the server. Please try the local registration option.');
    }
    
    // Rethrow the error with better formatting
    throw error;
  }
}

/**
 * Register locally (no server API) - fallback method
 * @async
 * @function registerLocal
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} [userData.email] - Email address (optional)
 * @param {string} userData.password - Password (stored in hashed form)
 * @returns {Promise<Object>} Registration response with user data
 */
export async function registerLocal({ username, email, password }) {
  try {
    // If email is not provided, use username as email
    const userEmail = email || `${username}@example.com`;
    
    // Generate a simple hash of the password (not secure, just for demo)
    // In a real app, we would use a proper hashing library
    const passwordHash = await simpleHash(password);
    
    // Create a mock user object
    const userId = Date.now().toString();
    const user = {
      id: userId,
      username,
      email: userEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
    
    // Check if username already exists
    if (localUsers.some(u => u.username === username)) {
      throw new Error('Username is already taken');
    }
    
    // Add user to local storage
    localUsers.push(user);
    localStorage.setItem('localUsers', JSON.stringify(localUsers));
    
    // Store current user
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email
    }));
    
    // Clear the user cache to force a refresh
    clearUserCache();
    
    // Notify listeners of auth state change
    notifyAuthStateChange();
    
    // Return mock response similar to API
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: 'mock-jwt-token'
    };
  } catch (error) {
    console.error('Local registration error:', error);
    throw error;
  }
}

/**
 * Simple string hashing function (NOT SECURE - JUST FOR DEMO)
 * In a real app, use a proper crypto library
 * @private
 * @async
 * @function simpleHash
 * @param {string} str - String to hash
 * @returns {Promise<string>} Hashed string
 */
async function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * Login a user
 * @async
 * @function login
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Login response with user data and token
 */
export async function login({ username, password }) {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.login, {
      username,
      password
    });
    
    // Store JWT token in localStorage
    if (response.token) {
      storeAuthToken(response.token);
    }
    
    // Store user in localStorage as a fallback
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    
    // Clear the user cache to force a refresh
    clearUserCache();
    
    // Notify listeners of auth state change
    notifyAuthStateChange();
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Logout the current user
 * @async
 * @function logout
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    const token = getAuthToken();
    
    // If we have a token, try to call the server logout endpoint
    if (token) {
      try {
        await apiClient.post(AUTH_ENDPOINTS.logout, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.warn('Error calling logout endpoint:', error);
        // Continue with local logout even if server logout fails
      }
    }
    
    // Clear auth token
    clearAuthToken();
    
    // Remove user from localStorage
    localStorage.removeItem('currentUser');
    
    // Clear the user cache
    clearUserCache();
    
    // Notify listeners of auth state change
    notifyAuthStateChange();
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cache and notify even if API call fails
    clearUserCache();
    clearAuthToken();
    localStorage.removeItem('currentUser');
    notifyAuthStateChange();
    
    throw error;
  }
}

/**
 * Get the current authenticated user
 * @async
 * @function getCurrentUser
 * @param {boolean} [forceRefresh=false] - Whether to force a refresh from the API
 * @returns {Promise<Object|null>} Current user data or null if not authenticated
 */
export async function getCurrentUser(forceRefresh = false) {
  try {
    const now = Date.now();
    
    // Return cached user if available and not expired
    if (!forceRefresh && 
        currentUserCache.user && 
        (now - currentUserCache.timestamp < currentUserCache.expiresIn)) {
      return currentUserCache.user;
    }
    
    // Try to get token
    const token = getAuthToken();
    
    if (!token) {
      // If no token, try to get user from localStorage as fallback
      const localUser = localStorage.getItem('currentUser');
      if (localUser) {
        const user = JSON.parse(localUser);
        updateUserCache(user);
        return user;
      }
      return null;
    }
    
    // Fetch from API with token
    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.me, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response && response.user) {
        // Update cache and localStorage
        updateUserCache(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return response.user;
      }
    } catch (apiError) {
      console.error('API error getting current user:', apiError);
      
      // If API fails, try to get user from localStorage as fallback
      const localUser = localStorage.getItem('currentUser');
      if (localUser) {
        const user = JSON.parse(localUser);
        updateUserCache(user);
        return user;
      }
    }
    
    // Clear cache if no user found
    clearUserCache();
    return null;
  } catch (error) {
    // Clear cache on error
    clearUserCache();
    
    // Don't log 401 or 404 errors (expected when not logged in)
    if (error.status !== 401 && error.status !== 404) {
      console.error('Error getting current user:', error);
    } else {
      console.log('User not authenticated');
    }
    
    return null;
  }
}

/**
 * Check if a user is authenticated
 * @async
 * @function isAuthenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Update the user cache
 * @private
 * @function updateUserCache
 * @param {Object} user - User data to cache
 */
function updateUserCache(user) {
  currentUserCache = {
    user,
    timestamp: Date.now(),
    expiresIn: 60000 // 1 minute
  };
}

/**
 * Clear the user cache
 * @private
 * @function clearUserCache
 */
function clearUserCache() {
  currentUserCache = {
    user: null,
    timestamp: 0,
    expiresIn: 60000
  };
}

/**
 * Subscribe to authentication state changes
 * @function onAuthStateChange
 * @param {Function} listener - Callback function to be called when auth state changes
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChange(listener) {
  authStateListeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = authStateListeners.indexOf(listener);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners about auth state change
 * @private
 * @async
 * @function notifyAuthStateChange
 */
async function notifyAuthStateChange() {
  const user = await getCurrentUser(true);
  
  // Call all listeners with the current user
  authStateListeners.forEach(listener => {
    try {
      listener(user);
    } catch (e) {
      console.error('Error in auth state change listener:', e);
    }
  });
}

/**
 * Login locally with saved user data
 * @async
 * @function loginLocal
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Login response with user data
 */
export async function loginLocal({ username, password }) {
  try {
    console.log('Attempting local login for:', username);
    
    // Get local users from storage
    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
    
    // Hash the password for comparison
    const passwordHash = await simpleHash(password);
    
    // Find the user with matching username
    const user = localUsers.find(u => u.username === username);
    
    if (!user) {
      throw new Error('User not found locally');
    }
    
    // Check password (this is simplified for demo purposes)
    // In a real app, we would use a proper password verification
    if (user.passwordHash !== passwordHash) {
      throw new Error('Invalid password');
    }
    
    // Store current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email
    }));
    
    // Clear the user cache to force a refresh
    clearUserCache();
    
    // Notify listeners of auth state change
    notifyAuthStateChange();
    
    // Return mock response similar to API
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: 'mock-jwt-token'
    };
  } catch (error) {
    console.error('Local login error:', error);
    throw error;
  }
}

/**
 * Auth service object with all auth methods
 */
export const authService = {
  register,
  registerLocal,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  onAuthStateChange,
  loginLocal
}; 