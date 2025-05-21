// mock-auth.js - Mock authentication service for frontend development
// This simulates a backend auth service using localStorage

/**
 * Register a new user
 * @param {Object} userData - User data (username, email, password)
 * @returns {Promise<Object>} - Promise resolving to the user data and token
 */
export async function register(userData) {
  try {
    console.log('Mock Auth: register() called with:', { ...userData, password: '******' });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    
    // Check if username already exists
    if (users.find(user => user.username === userData.username)) {
      throw new Error('Username already taken');
    }
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email already taken');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      // In a real app, we would hash the password
      passwordHash: userData.password
    };
    
    // Add user to storage
    users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(users));
    
    // Create mock token (in a real app this would be a JWT)
    const token = btoa(JSON.stringify({ userId: newUser.id, username: newUser.username }));
    
    // Store user session
    const userToReturn = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    };
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userToReturn));
    
    console.log('Mock Auth: User registered and stored');
    
    return { user: userToReturn, token };
  } catch (error) {
    console.error('Mock Auth: Registration error:', error);
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
    console.log('Mock Auth: login() called with:', { ...credentials, password: '******' });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    
    // Find user by username and verify password
    const user = users.find(user => 
      user.username === credentials.username && 
      user.passwordHash === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Create mock token
    const token = btoa(JSON.stringify({ userId: user.id, username: user.username }));
    
    // Store user session
    const userToReturn = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userToReturn));
    
    console.log('Mock Auth: User logged in and stored');
    
    return { user: userToReturn, token };
  } catch (error) {
    console.error('Mock Auth: Login error:', error);
    throw error;
  }
}

/**
 * Log out the current user
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Mock Auth: User logged out');
}

/**
 * Get the current user from localStorage
 * @returns {Object|null} - The current user or null if not logged in
 */
export function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Get the authentication token from localStorage
 * @returns {string|null} - The authentication token or null if not logged in
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Check if a user is logged in
 * @returns {boolean} - True if logged in, false otherwise
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * Get the current user from the server (validates token)
 * In this mock version, we just return the locally stored user
 * @returns {Promise<Object>} - Promise resolving to the current user
 */
export async function getCurrentUserFromServer() {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real implementation, this would validate the token with the server
    // For mock purposes, we'll just use the stored user
    const user = getCurrentUser();
    
    if (!user) {
      logout();
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    console.error('Mock Auth: Get current user error:', error);
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