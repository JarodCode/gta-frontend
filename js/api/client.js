/**
 * API Client Module
 * 
 * This module provides a client for making API requests with proper error handling,
 * authentication, and request/response processing.
 * 
 * @module api/client
 */

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3000';

// Default options for fetch requests
const DEFAULT_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include', // Include cookies for authentication
};

/**
 * Custom API error class
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Create an API error
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {any} data - Additional error data
   */
  constructor(message, status, data = null) {
    // Ensure we have a proper string message
    const errorMessage = typeof message === 'object' 
      ? JSON.stringify(message) 
      : (message || 'Unknown API error');
    
    super(errorMessage);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
  
  /**
   * Get a human-readable representation of the error
   * @returns {string} String representation of the error
   */
  toString() {
    let result = `${this.name}: ${this.message}`;
    if (this.status) {
      result += ` (${this.status})`;
    }
    if (this.data) {
      try {
        const dataStr = typeof this.data === 'object' 
          ? JSON.stringify(this.data) 
          : String(this.data);
        result += ` - ${dataStr}`;
      } catch (e) {
        // If we can't stringify the data, ignore it
      }
    }
    return result;
  }
}

/**
 * Get the auth token from localStorage
 * @private
 * @function getAuthToken
 * @returns {string|null} Auth token or null if not found
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Make an API request
 * @async
 * @function request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>} Response data
 * @throws {ApiError} If the request fails
 */
async function request(endpoint, options = {}) {
  try {
    // Add token to headers if available
    const token = getAuthToken();
    const headers = {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Prepare URL - handle both absolute and relative URLs
    let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    // Add query parameters if provided
    if (options.params) {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      }
      const queryString = queryParams.toString();
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }
    
    // Log request in development
    if (import.meta.env?.DEV) {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      if (options.body) {
        console.log('Request Body:', options.body);
      }
    }

    // Make the request
    const response = await fetch(url, {
      ...DEFAULT_OPTIONS,
      ...options,
      headers
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    // Parse the response
    let data;
    if (isJson) {
      try {
        data = await response.json();
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        data = { error: 'Invalid JSON response' };
      }
    } else {
      try {
        data = await response.text();
      } catch (error) {
        console.error('Error parsing text response:', error);
        data = { error: 'Invalid text response' };
      }
    }
    
    // Handle error responses
    if (!response.ok) {
      // For auth errors, clear the token if it's expired or invalid
      if (response.status === 401) {
        // Only clear token if it's an auth endpoint or specifically mentions token issues
        const isAuthEndpoint = endpoint.includes('/users/me') || 
                              endpoint.includes('/login') || 
                              endpoint.includes('/register');
        
        const isTokenError = data && 
                            (data.error?.toLowerCase().includes('token') || 
                             data.error?.toLowerCase().includes('auth'));
        
        if (isAuthEndpoint || isTokenError) {
          console.warn('Authentication token issue detected, clearing token');
          localStorage.removeItem('authToken');
        }
      }
      
      throw new ApiError(
        data.error || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    // If it's already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    console.error('API request failed:', error);
    
    // Create a more user-friendly error message
    const errorMessage = error.message === 'Failed to fetch' 
      ? 'Network error: Could not connect to the server. Please check your internet connection.'
      : (error.message || 'Unknown network error');
      
    throw new ApiError(
      errorMessage,
      0,
      { originalError: error.toString() }
    );
  }
}

/**
 * Make a GET request
 * @async
 * @function get
 * @param {string} endpoint - API endpoint
 * @param {Object} [options={}] - Request options
 * @returns {Promise<any>} Response data
 */
async function get(endpoint, options = {}) {
  const { params, ...restOptions } = options;
  
  // Add query parameters
  let url = endpoint;
  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
  }
  
  return request(url, {
    method: 'GET',
    ...restOptions,
  });
}

/**
 * Make a POST request
 * @async
 * @function post
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} [options={}] - Request options
 * @returns {Promise<any>} Response data
 */
async function post(endpoint, data, options = {}) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Make a PUT request
 * @async
 * @function put
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} [options={}] - Request options
 * @returns {Promise<any>} Response data
 */
async function put(endpoint, data, options = {}) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Make a PATCH request
 * @async
 * @function patch
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} [options={}] - Request options
 * @returns {Promise<any>} Response data
 */
async function patch(endpoint, data, options = {}) {
  return request(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Make a DELETE request
 * @async
 * @function del
 * @param {string} endpoint - API endpoint
 * @param {Object} [options={}] - Request options
 * @returns {Promise<any>} Response data
 */
async function del(endpoint, options = {}) {
  return request(endpoint, {
    method: 'DELETE',
    ...options,
  });
}

/**
 * API client object with all HTTP methods
 */
export const apiClient = {
  request,
  get,
  post,
  put,
  patch,
  delete: del,
}; 