// auth.js - Real authentication service using backend API with cookie storage

// API endpoint for auth - configurable for different environments
const BACKEND_PORT = 8080; // Default backend port
const API_URL = `http://localhost:${BACKEND_PORT}/api/auth`;
console.log('Auth API URL:', API_URL);

/**
 * Helper function to set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration
 */
function setCookie(name, value, days = 30) {
  try {
    console.log(`Setting cookie ${name} with expiration ${days} days`);
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    // Set the cookie with essential attributes - use Lax for better compatibility
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    
    // Verify cookie was set
    const cookieExists = document.cookie.split(';').some(item => item.trim().startsWith(`${name}=`));
    console.log(`Cookie ${name} was ${cookieExists ? 'successfully set' : 'NOT set'}`);
    
    // If localStorage contains this key, remove it to ensure we're using cookies
    if (localStorage.getItem(name)) {
      console.log(`Removing ${name} from localStorage to prevent conflicts`);
      localStorage.removeItem(name);
    }
    
    // If cookie was not set, fall back to localStorage
    if (!cookieExists) {
      console.log(`Cookie ${name} could not be set, falling back to localStorage`);
      localStorage.setItem(name, value);
    }
  } catch (error) {
    console.error('Error setting cookie:', error);
    // Fallback to localStorage if cookies fail
    localStorage.setItem(name, value);
    console.log(`Fallback: Stored ${name} in localStorage instead`);
  }
}

/**
 * Helper function to get a cookie
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
function getCookie(name) {
  try {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        const value = cookie.substring(cookieName.length, cookie.length);
        console.log(`Retrieved cookie ${name}`);
        return value;
      }
    }
    
    // If cookie not found, check localStorage as fallback
    const localValue = localStorage.getItem(name);
    if (localValue) {
      console.log(`Cookie ${name} not found, but found in localStorage`);
      return localValue;
    }
    
    console.log(`Cookie ${name} not found`);
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    // Fallback to localStorage
    return localStorage.getItem(name);
  }
}

/**
 * Helper function to delete a cookie
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
  try {
    console.log(`Deleting cookie ${name}`);
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    
    // Also remove from localStorage if present
    if (localStorage.getItem(name)) {
      localStorage.removeItem(name);
    }
    
    // Verify cookie was deleted
    const cookieExists = document.cookie.split(';').some(item => item.trim().startsWith(`${name}=`));
    console.log(`Cookie ${name} was ${!cookieExists ? 'successfully deleted' : 'NOT deleted'}`);
  } catch (error) {
    console.error('Error deleting cookie:', error);
    // Ensure it's removed from localStorage at least
    localStorage.removeItem(name);
  }
}

/**
 * Parse JSON safely with error handling
 * @param {Response} response - The fetch response object
 * @returns {Promise<Object>} - Parsed JSON data
 */
async function safeParseJson(response) {
  try {
    const text = await response.text();
    
    // Log the raw response text for debugging
    console.log('Raw response:', text);
    
    // Try to parse the text as JSON
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse response text:', text);
      
      // Attempt to clean the response if it has extra characters
      let cleanedText = text.trim();
      
      // Try to find valid JSON in the string if possible
      if (cleanedText.includes('{') && cleanedText.includes('}')) {
        try {
          const start = cleanedText.indexOf('{');
          const end = cleanedText.lastIndexOf('}') + 1;
          cleanedText = cleanedText.substring(start, end);
          console.log('Attempting to parse cleaned JSON:', cleanedText);
          return JSON.parse(cleanedText);
        } catch (e) {
          console.error('Failed to parse cleaned JSON', e);
        }
      }
      
      // If all attempts fail, return a generic error object
      return { error: 'Invalid server response' };
    }
  } catch (error) {
    console.error('Error reading response text:', error);
    return { error: 'Could not read server response' };
  }
}

/**
 * Register a new user
 * @param {Object} userData - User data (username, email, password)
 * @returns {Promise<Object>} - Promise resolving to the user data and token
 */
export async function register(userData) {
  try {
    console.log('Auth: register() called with:', { ...userData, password: '******' });
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await safeParseJson(response);
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    // Store token and user info in cookies
    console.log('Setting auth data in cookies after registration');
    setCookie('token', data.token);
    setCookie('user', JSON.stringify(data.user));
    
    // For debugging: Check if cookies were actually set
    setTimeout(() => {
      const tokenCookie = getCookie('token');
      const userCookie = getCookie('user');
      console.log('After registration - cookie check:');
      console.log('token cookie exists:', !!tokenCookie);
      console.log('user cookie exists:', !!userCookie);
      console.log('document.cookie:', document.cookie);
    }, 100);
    
    console.log('Auth: User registered successfully');
    
    return data;
  } catch (error) {
    console.error('Auth: Registration error:', error);
    throw error;
  }
}

/**
 * Log in a user
 * @param {Object} credentials - User credentials (username, password)
 * @returns {Promise<Object>} - Promise resolving to the user data and token
 */
export async function login(credentials) {
  try {
    console.log('Auth: login() called with:', { ...credentials, password: '******' });
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await safeParseJson(response);
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    // Store token and user info in cookies
    console.log('Setting auth data in cookies after login');
    setCookie('token', data.token);
    setCookie('user', JSON.stringify(data.user));
    
    // For debugging: Check if cookies were actually set
    setTimeout(() => {
      const tokenCookie = getCookie('token');
      const userCookie = getCookie('user');
      console.log('After login - cookie check:');
      console.log('token cookie exists:', !!tokenCookie);
      console.log('user cookie exists:', !!userCookie);
      console.log('document.cookie:', document.cookie);
    }, 100);
    
    console.log('Auth: User logged in successfully');
    
    return data;
  } catch (error) {
    console.error('Auth: Login error:', error);
    throw error;
  }
}

/**
 * Log out the current user
 */
export function logout() {
  console.log('Auth: Logging out user');
  deleteCookie('token');
  deleteCookie('user');
  
  // For debugging: Check if cookies were actually deleted
  setTimeout(() => {
    const tokenCookie = getCookie('token');
    const userCookie = getCookie('user');
    console.log('After logout - cookie check:');
    console.log('token cookie exists:', !!tokenCookie);
    console.log('user cookie exists:', !!userCookie); 
    console.log('document.cookie:', document.cookie);
  }, 100);
  
  console.log('Auth: User logged out');
}

/**
 * Get the current user from cookie
 * @returns {Object|null} - The current user or null if not logged in
 */
export function getCurrentUser() {
  console.log('Auth: getCurrentUser() called');
  const userJson = getCookie('user');
  console.log('Auth: userJson from cookie:', userJson ? 'exists' : 'not found');
  
  // If we can't get from cookie, try localStorage as fallback
  if (!userJson) {
    const localUserJson = localStorage.getItem('user');
    if (localUserJson) {
      console.log('Auth: userJson found in localStorage instead');
      // Migrate to cookie
      setCookie('user', localUserJson);
      return JSON.parse(localUserJson);
    }
    return null;
  }
  
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Get the authentication token from cookie
 * @returns {string|null} - The authentication token or null if not logged in
 */
export function getToken() {
  console.log('Auth: getToken() called');
  const token = getCookie('token');
  console.log('Auth: token from cookie:', token ? 'exists' : 'not found');
  
  // If we can't get from cookie, try localStorage as fallback
  if (!token) {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      console.log('Auth: token found in localStorage instead');
      // Migrate to cookie
      setCookie('token', localToken);
      return localToken;
    }
  }
  
  return token;
}

/**
 * Check if a user is logged in
 * @returns {boolean} - True if logged in, false otherwise
 */
export function isLoggedIn() {
  const hasToken = !!getToken();
  console.log('Auth: User is logged in:', hasToken);
  return hasToken;
}

/**
 * Get the current user from the server (validates token)
 * This will verify the token with the backend
 * @returns {Promise<Object>} - Promise resolving to the current user
 */
export async function getCurrentUserFromServer() {
  try {
    const token = getToken();
    
    if (!token) {
      console.log('Auth: No token found, not authenticated');
      throw new Error('Not authenticated');
    }
    
    console.log('Auth: Fetching user data from server...');
    
    // Setup request timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      // Try using fetch with credentials included
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'same-origin', // Include cookies in the request
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Auth: Server response status:', response.status);
      
      const data = await safeParseJson(response);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Auth: Token invalid or expired (401), logging out');
          logout();
          throw new Error('Your session has expired. Please log in again.');
        }
        
        console.error('Auth: Server returned error:', data.error || 'Unknown error');
        throw new Error(data.error || 'Failed to get user');
      }
      
      console.log('Auth: Successfully retrieved user data from server');
      
      // Update the user data in cookie
      setCookie('user', JSON.stringify(data.user));
      
      return data.user;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle various fetch errors
      if (fetchError.name === 'AbortError') {
        console.error('Auth: Request timed out after 5 seconds');
        
        // Return cached user if available
        const cachedUser = getCurrentUser();
        if (cachedUser) {
          console.log('Auth: Using cached user data due to timeout');
          return cachedUser;
        }
        
        throw new Error('Request timed out. Server may be unavailable.');
      }
      
      // Handle network errors
      if (fetchError instanceof TypeError && 
          (fetchError.message.includes('NetworkError') || 
           fetchError.message.includes('Failed to fetch'))) {
        console.error('Auth: Network error - Server may be down or CORS issue:', fetchError.message);
        
        // Log more details about the request
        console.log('Auth: Attempted to fetch from:', `${API_URL}/me`);
        console.log('Auth: Current origin:', window.location.origin);
        
        // Return the cached user if available
        const cachedUser = getCurrentUser();
        if (cachedUser) {
          console.log('Auth: Using cached user due to network error');
          return cachedUser;
        }
        
        throw new Error('Network error: Server may be down or there might be a CORS issue. Check console for details.');
      }
      
      // Re-throw any other errors
      console.error('Auth: Error fetching user data:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Auth: Get current user error:', error);
    
    // Always return cachedUser if there's any error and it's available
    const cachedUser = getCurrentUser();
    if (cachedUser) {
      console.log('Auth: Returning cached user after error');
      return cachedUser;
    }
    
    throw error;
  }
}

/**
 * Get authorization headers for authenticated requests
 * @returns {Object} - Headers object with Authorization header
 */
export function getAuthHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Debug function to display all cookies in the console
window.addEventListener('load', () => {
  console.log('Auth module loaded - Current cookies:');
  console.log('document.cookie:', document.cookie);
  
  // Check for existing tokens in both cookie and localStorage
  const tokenCookie = getCookie('token');
  const userCookie = getCookie('user');
  const tokenLocal = localStorage.getItem('token');
  const userLocal = localStorage.getItem('user');
  
  console.log({
    tokenInCookie: !!tokenCookie,
    userInCookie: !!userCookie,
    tokenInLocalStorage: !!tokenLocal,
    userInLocalStorage: !!userLocal
  });
  
  // If we have data in localStorage but not in cookies, migrate it
  if (!tokenCookie && tokenLocal) {
    console.log('Migrating token from localStorage to cookie');
    setCookie('token', tokenLocal);
  }
  
  if (!userCookie && userLocal) {
    console.log('Migrating user from localStorage to cookie');
    setCookie('user', userLocal);
  }
});

// Helper function to check if an API endpoint is reachable
async function checkApiEndpoint() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    console.log('Testing API connection at:', API_URL);
    const response = await fetch(`${API_URL}/me`, {
      method: 'OPTIONS',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('API endpoint reachable:', API_URL);
    return true;
  } catch (error) {
    console.error('API endpoint not reachable:', API_URL, error.message);
    return false;
  }
}

// Check API connection on load
window.addEventListener('load', async () => {
  const isApiReachable = await checkApiEndpoint();
  if (!isApiReachable) {
    console.warn('Cannot reach API at port 8000. If you have the backend running on a different port, please update BACKEND_PORT in auth.js');
  }
}); 