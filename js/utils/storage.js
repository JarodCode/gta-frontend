/**
 * Storage Utility Functions
 * 
 * This module provides utility functions for managing browser storage,
 * including localStorage, sessionStorage, and utility functions for
 * storing and retrieving data with expiration.
 * 
 * @module utils/storage
 */

const APP_PREFIX = 'gamelog_';

/**
 * Set an item in localStorage with optional expiration
 * @function setLocalItem
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {Object} [options] - Storage options
 * @param {number} [options.expiry] - Expiration time in milliseconds
 */
export function setLocalItem(key, value, options = {}) {
  const prefixedKey = `${APP_PREFIX}${key}`;
  
  let storageItem = {
    value,
    timestamp: Date.now()
  };
  
  if (options.expiry) {
    storageItem.expiry = options.expiry;
  }
  
  localStorage.setItem(prefixedKey, JSON.stringify(storageItem));
}

/**
 * Get an item from localStorage, respecting expiration
 * @function getLocalItem
 * @param {string} key - Storage key
 * @param {*} [defaultValue] - Default value if item is not found or expired
 * @returns {*} The stored value or defaultValue
 */
export function getLocalItem(key, defaultValue = null) {
  const prefixedKey = `${APP_PREFIX}${key}`;
  const item = localStorage.getItem(prefixedKey);
  
  if (!item) return defaultValue;
  
  try {
    const parsedItem = JSON.parse(item);
    
    // Check if item has expired
    if (parsedItem.expiry && Date.now() > parsedItem.timestamp + parsedItem.expiry) {
      localStorage.removeItem(prefixedKey);
      return defaultValue;
    }
    
    return parsedItem.value;
  } catch (error) {
    // If parsing fails, return the raw item for backward compatibility
    return item;
  }
}

/**
 * Remove an item from localStorage
 * @function removeLocalItem
 * @param {string} key - Storage key
 */
export function removeLocalItem(key) {
  const prefixedKey = `${APP_PREFIX}${key}`;
  localStorage.removeItem(prefixedKey);
}

/**
 * Check if an item exists in localStorage and is not expired
 * @function hasLocalItem
 * @param {string} key - Storage key
 * @returns {boolean} Whether the item exists and is valid
 */
export function hasLocalItem(key) {
  const prefixedKey = `${APP_PREFIX}${key}`;
  const item = localStorage.getItem(prefixedKey);
  
  if (!item) return false;
  
  try {
    const parsedItem = JSON.parse(item);
    
    // Check if item has expired
    if (parsedItem.expiry && Date.now() > parsedItem.timestamp + parsedItem.expiry) {
      localStorage.removeItem(prefixedKey);
      return false;
    }
    
    return true;
  } catch (error) {
    // If parsing fails, return true for backward compatibility
    return true;
  }
}

/**
 * Set an item in sessionStorage
 * @function setSessionItem
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function setSessionItem(key, value) {
  const prefixedKey = `${APP_PREFIX}${key}`;
  sessionStorage.setItem(prefixedKey, JSON.stringify(value));
}

/**
 * Get an item from sessionStorage
 * @function getSessionItem
 * @param {string} key - Storage key
 * @param {*} [defaultValue] - Default value if item is not found
 * @returns {*} The stored value or defaultValue
 */
export function getSessionItem(key, defaultValue = null) {
  const prefixedKey = `${APP_PREFIX}${key}`;
  const item = sessionStorage.getItem(prefixedKey);
  
  if (!item) return defaultValue;
  
  try {
    return JSON.parse(item);
  } catch (error) {
    return item;
  }
}

/**
 * Remove an item from sessionStorage
 * @function removeSessionItem
 * @param {string} key - Storage key
 */
export function removeSessionItem(key) {
  const prefixedKey = `${APP_PREFIX}${key}`;
  sessionStorage.removeItem(prefixedKey);
}

/**
 * Clear all app-related items from localStorage
 * @function clearLocalStorage
 */
export function clearLocalStorage() {
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(APP_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Clear all app-related items from sessionStorage
 * @function clearSessionStorage
 */
export function clearSessionStorage() {
  const keysToRemove = [];
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.startsWith(APP_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
  });
}

/**
 * Get the total storage usage in bytes
 * @function getStorageUsage
 * @returns {Object} Storage usage information
 */
export function getStorageUsage() {
  let localUsage = 0;
  let sessionUsage = 0;
  let appLocalUsage = 0;
  let appSessionUsage = 0;
  
  // Calculate localStorage usage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    const usage = (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
    
    localUsage += usage;
    
    if (key.startsWith(APP_PREFIX)) {
      appLocalUsage += usage;
    }
  }
  
  // Calculate sessionStorage usage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    const usage = (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
    
    sessionUsage += usage;
    
    if (key.startsWith(APP_PREFIX)) {
      appSessionUsage += usage;
    }
  }
  
  return {
    localTotal: localUsage,
    sessionTotal: sessionUsage,
    appLocalTotal: appLocalUsage,
    appSessionTotal: appSessionUsage,
    total: localUsage + sessionUsage
  };
} 