// reviews.js - Module for handling game reviews
import { getCurrentUser } from './auth.js';

// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';
const REVIEWS_ENDPOINTS = {
  getAll: `${API_BASE_URL}/reviews`,
  getByGame: (gameId) => `${API_BASE_URL}/reviews/game/${gameId}`,
  getByUser: (userId) => `${API_BASE_URL}/reviews/user/${userId}`,
  add: `${API_BASE_URL}/reviews`,
  delete: (reviewId) => `${API_BASE_URL}/reviews/${reviewId}`
};

// WebSocket endpoint for review notifications - use same port as API
const WS_REVIEWS_ENDPOINT = 'ws://localhost:8080/ws/reviews';

// In-memory cache for reviews until API is implemented
const reviewsCache = {};
const ratingsCache = {};

// WebSocket connection for real-time review notifications
let websocket = null;
const reviewListeners = [];

// Initialize WebSocket when needed, not automatically
export async function ensureWebSocketConnection() {
  if (!websocket || websocket.readyState === WebSocket.CLOSED) {
    await initWebSocket();
  }
  return websocket;
}

// Initialize WebSocket connection
async function initWebSocket() {
  if (websocket !== null && websocket.readyState !== WebSocket.CLOSED) {
    // Already initialized and not closed
    return websocket;
  }
  
  try {
    console.log('Connecting to review notification WebSocket...');
    
    // Get current user 
    const user = await getCurrentUser();
    let wsUrl = WS_REVIEWS_ENDPOINT;
    
    // Add user ID to WebSocket URL if available
    if (user && user.id) {
      wsUrl += `?userId=${encodeURIComponent(user.id)}`;
    }
    
    websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('WebSocket connection established for review notifications');
    };
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        if (data.type === 'new_review') {
          // Handle new review notification
          const { gameId, review } = data;
          
          // Update cache
          if (!reviewsCache[gameId]) {
            reviewsCache[gameId] = [];
          }
          
          // Check if review already exists
          const existingIndex = reviewsCache[gameId].findIndex(r => r.id === review.id);
          if (existingIndex >= 0) {
            // Update existing review
            reviewsCache[gameId][existingIndex] = review;
          } else {
            // Add new review
            reviewsCache[gameId].push(review);
          }
          
          // Update rating
          updateGameRating(gameId);
          
          // Notify listeners
          notifyReviewListeners({
            type: 'new_review',
            gameId,
            review
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    websocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      websocket = null;
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        initWebSocket();
      }, 5000);
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Don't try to reconnect immediately on error
      // The onclose handler will trigger a reconnect if needed
    };
    
    return websocket;
  } catch (error) {
    console.error('Failed to initialize WebSocket:', error);
    return null;
  }
}

// Utility function for API calls
async function apiCall(url, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const options = {
    method,
    headers,
    credentials: 'include', // Important for cookies
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    console.log(`Making ${method} request to ${url} with options:`, options);
    const response = await fetch(url, options);
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`Server error: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log(`API response data:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`API call error to ${url}:`, error);
    throw error;
  }
}

// Get all reviews for a specific game
export function getGameReviews(gameId) {
  // Return cached reviews for this game or empty array
  return reviewsCache[gameId] || [];
}

// Get all reviews for a specific game (async version that fetches from API)
export async function fetchGameReviews(gameId) {
  try {
    console.log(`Fetching reviews for game ${gameId} from API...`);
    
    // Call the API to get reviews for this game
    const url = REVIEWS_ENDPOINTS.getByGame(gameId);
    console.log(`API URL: ${url}`);
    
    const response = await apiCall(url);
    console.log(`API response:`, response);
    
    // If we got a successful response with reviews
    if (response && response.reviews) {
      console.log(`Received ${response.reviews.length} reviews from API`);
      
      // Update the cache
      reviewsCache[gameId] = response.reviews;
      
      // Update rating
      updateGameRating(gameId);
      
      return response.reviews;
    }
    
    return getGameReviews(gameId); // Fall back to cached reviews if API fails
  } catch (error) {
    console.error(`Error fetching reviews for game ${gameId}:`, error);
    return getGameReviews(gameId); // Fall back to cached reviews
  }
}

// Get all reviews by a specific user
export function getUserReviews(userId) {
  const userReviews = [];
  
  // Iterate through all game reviews to find reviews by this user
  Object.entries(reviewsCache).forEach(([gameId, reviews]) => {
    reviews.forEach(review => {
      if (review.userId === userId) {
        userReviews.push({
          ...review,
          gameId
        });
      }
    });
  });
  
  return userReviews;
}

// Add a new review for a game
export async function addReview(gameId, content, rating, gameTitle, gameCoverUrl) {
  try {
    // Get current user with await to ensure we have the latest data
    const user = await getCurrentUser();
    
    // Strict authentication check
    if (!user) {
      console.error('Authentication required: User tried to submit a review without being logged in');
      throw new Error('You must be logged in to write a review');
    }
    
    if (!user.id || !user.username) {
      console.error('Invalid user data:', user);
      throw new Error('Invalid user session. Please log in again.');
    }
    
    if (!gameId) {
      throw new Error('Game ID is required');
    }
    
    if (!content || content.trim() === '') {
      throw new Error('Review content is required');
    }
    
    if (!rating || rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    // Debug log
    console.log('Adding review:', {
      gameId,
      userId: user.id,
      rating,
      content
    });
    
    // Create the review object
    const review = {
      gameId,
      content,
      rating,
      userId: user.id,
      username: user.username,
      createdAt: new Date().toISOString(),
      // Additional information for notifications
      gameTitle: gameTitle || 'Unknown Game',
      gameCoverUrl: gameCoverUrl || ''
    };
    
    // Send to API
    try {
      const result = await apiCall(REVIEWS_ENDPOINTS.add, 'POST', review);
      console.log('Review added successfully:', result);
      
      // Update local cache
      if (!reviewsCache[gameId]) {
        reviewsCache[gameId] = [];
      }
      
      // Use the server-generated review, or fall back to our local version
      const savedReview = result.review || { ...review, id: Date.now().toString() };
      
      // Add to cache
      reviewsCache[gameId].push(savedReview);
      
      // Update rating
      updateGameRating(gameId);
      
      // Send notification via WebSocket if we don't have a proper API yet
      if (!result.review) {
        sendReviewNotification(gameId, savedReview);
      }
      
      return savedReview;
    } catch (error) {
      console.error('Error adding review to API:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in addReview:', error);
    throw error;
  }
}

// Delete a review
export async function deleteReview(gameId, reviewId) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to delete a review');
  }
  
  try {
    // Call the API to delete the review
    const result = await apiCall(REVIEWS_ENDPOINTS.delete(reviewId), 'DELETE');
    
    // If successful, update the local cache
    if (result && result.success) {
      if (!reviewsCache[gameId]) {
        return true; // Nothing to delete locally
      }
      
      const reviewIndex = reviewsCache[gameId].findIndex(review => review.id === reviewId);
      
      if (reviewIndex !== -1) {
        // Remove the review from cache
        reviewsCache[gameId].splice(reviewIndex, 1);
        
        // Update game ratings
        updateGameRating(gameId);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Initialize ratings for all games if they don't exist
 * @param {Array} games - Array of game objects
 */
function initializeGameRatings(games) {
  let hasChanges = false;

  // Add ratings for any new games
  games.forEach(game => {
    if (!ratingsCache[game.id]) {
      ratingsCache[game.id] = {
        rating: 0,
        count: 0
      };
      hasChanges = true;
    }
  });

  return ratingsCache;
}

/**
 * Sort games by user ratings, with alphabetical order as tiebreaker
 * @param {Array} games - Array of game objects
 * @returns {Array} Sorted array of games
 */
export function getGamesSortedByUserRating(games) {
  // Initialize ratings for all games
  const gameRatings = initializeGameRatings(games);
  
  // Debug log
  console.log('All game ratings:', gameRatings);
  
  // Enhance games with user rating data
  const enhancedGames = games.map(game => {
    const ratingData = gameRatings[game.id] || { rating: 0, count: 0 };
    
    // Debug log for each game
    console.log('Game rating data:', {
      gameId: game.id,
      gameName: game.name,
      rating: ratingData.rating,
      count: ratingData.count
    });
    
    return {
      ...game,
      user_rating: ratingData.rating,
      user_rating_count: ratingData.count
    };
  });
  
  // Sort games by user rating (descending), then by name (ascending)
  return enhancedGames.sort((a, b) => {
    // First compare by rating
    const ratingDiff = b.user_rating - a.user_rating;
    if (ratingDiff !== 0) return ratingDiff;
    
    // If ratings are equal, sort by name
    return a.name.localeCompare(b.name);
  });
}

// Calculate and update the average rating for a game
export function updateGameRating(gameId) {
  const reviews = getGameReviews(gameId);
  
  if (reviews.length === 0) {
    // If no reviews, set rating to 0 but keep the game in ratings
    ratingsCache[gameId] = {
      rating: 0,
      count: 0
    };
  } else {
    // Calculate average rating from reviews
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const avg = sum / reviews.length;
    
    ratingsCache[gameId] = {
      rating: Number(avg.toFixed(1)),
      count: reviews.length
    };
  }
  
  return ratingsCache[gameId];
}

// Get the rating for a specific game
export function getGameRating(gameId) {
  return ratingsCache[gameId] || { rating: 0, count: 0 };
}

// Get all game ratings
export function getAllGameRatings() {
  return ratingsCache;
}

// Send a review notification via WebSocket
async function sendReviewNotification(gameId, review) {
  try {
    // Ensure WebSocket connection is established
    await ensureWebSocketConnection();
    
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const notification = {
        type: 'new_review',
        gameId,
        review
      };
      
      websocket.send(JSON.stringify(notification));
      console.log('Sent review notification via WebSocket');
    } else {
      console.warn('WebSocket not connected, unable to send review notification');
      // Notify local listeners anyway
      notifyReviewListeners({
        type: 'new_review',
        gameId,
        review
      });
    }
  } catch (error) {
    console.error('Error sending review notification:', error);
    // Notify local listeners even if WebSocket fails
    notifyReviewListeners({
      type: 'new_review',
      gameId,
      review
    });
  }
}

// Subscribe to new review events
export async function onNewReview(callback) {
  // Ensure WebSocket connection is established
  try {
    await ensureWebSocketConnection();
  } catch (error) {
    console.warn('Could not establish WebSocket connection for review notifications:', error);
    // Continue anyway - local notifications will still work
  }
  
  // Add the listener
  reviewListeners.push(callback);
  
  // Return an unsubscribe function
  return () => {
    const index = reviewListeners.indexOf(callback);
    if (index !== -1) {
      reviewListeners.splice(index, 1);
    }
  };
}

// Notify all review listeners
function notifyReviewListeners(event) {
  reviewListeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('Error in review listener:', error);
    }
  });
} 