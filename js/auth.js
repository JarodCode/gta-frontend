/**
 * Auth Compatibility Layer
 * 
 * This module provides backward compatibility with the old auth functions.
 * It redirects calls to the new modular API structure.
 * 
 * @module auth
 */

import { authService } from './api/auth.js';

/**
 * Get the current authenticated user
 * @async
 * @function getCurrentUser
 * @returns {Promise<Object|null>} Current user or null if not authenticated
 */
export async function getCurrentUser() {
  console.log('Redirecting getCurrentUser to new API structure');
  try {
    return await authService.getCurrentUser();
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Log in a user
 * @async
 * @function login
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Logged in user
 */
export async function login(credentials) {
  console.log('Redirecting login to new API structure');
  return await authService.login(credentials);
}

/**
 * Register a new user
 * @async
 * @function register
 * @param {Object} userData - User data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} Registered user
 */
export async function register(userData) {
  console.log('Redirecting register to new API structure');
  return await authService.register(userData);
}

/**
 * Log out the current user
 * @async
 * @function logout
 * @returns {Promise<void>}
 */
export async function logout() {
  console.log('Redirecting logout to new API structure');
  return await authService.logout();
}

/**
 * Check if a user is authenticated
 * @async
 * @function isAuthenticated
 * @returns {Promise<boolean>} Whether the user is authenticated
 */
export async function isAuthenticated() {
  console.log('Redirecting isAuthenticated to new API structure');
  return await authService.isAuthenticated();
}

/**
 * Add a listener for auth state changes
 * @function onAuthStateChange
 * @param {Function} callback - Callback to call when auth state changes
 * @returns {Function} Function to remove the listener
 */
export function onAuthStateChange(callback) {
  console.log('Redirecting onAuthStateChange to new API structure');
  return authService.onAuthStateChange(callback);
} 