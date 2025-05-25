/**
 * Games API Module
 * 
 * This module provides functions for interacting with game-related API endpoints:
 * - Fetching games (popular, recent, search)
 * - Getting game details
 * - Managing game reviews and ratings
 * 
 * @module api/games
 */

import { apiClient } from './client.js';
import { getHardcodedGames, getGamesLikeApi } from '../hardcoded-games.js';

/**
 * Game API endpoints
 * @constant {Object} GAME_ENDPOINTS - API endpoints for game operations
 */
const GAME_ENDPOINTS = {
  games: '/games',
  popular: '/games/popular',
  recent: '/games/recent',
  search: '/games/search',
  game: (id) => `/games/${id}`,
  reviews: (gameId) => `/games/${gameId}/reviews`,
  review: (reviewId) => `/reviews/${reviewId}`,
  userReviews: (userId) => `/users/${userId}/reviews`,
  myReviews: '/users/me/reviews',
  ratings: '/games/ratings'
};

/**
 * Cache for game data to reduce API calls
 * @type {Object}
 */
const gameCache = {
  popular: { data: null, timestamp: 0 },
  recent: { data: null, timestamp: 0 },
  games: { data: null, timestamp: 0 },
  details: {}, // Map of gameId -> { data, timestamp }
  reviews: {}, // Map of gameId -> { data, timestamp }
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
};

/**
 * Get popular games
 * @async
 * @function getPopularGames
 * @param {Object} [options={}] - Options for the request
 * @param {number} [options.limit=10] - Maximum number of games to return
 * @param {number} [options.offset=0] - Number of games to skip
 * @param {boolean} [options.forceRefresh=false] - Whether to force a refresh from the API
 * @returns {Promise<Object>} Object containing games and pagination info
 */
export async function getPopularGames({
  limit = 10,
  offset = 0,
  forceRefresh = false
} = {}) {
  // Check cache if no refresh is forced
  if (!forceRefresh && 
      gameCache.popular.data && 
      Date.now() - gameCache.popular.timestamp < gameCache.cacheExpiry) {
    return gameCache.popular.data;
  }

  try {
    const response = await apiClient.get(GAME_ENDPOINTS.popular, {
      params: { limit, offset }
    });
    
    // Update cache
    gameCache.popular = {
      data: response,
      timestamp: Date.now()
    };
    
    return response;
  } catch (error) {
    console.error('Error fetching popular games:', error);
    console.log('Falling back to hardcoded games data');
    
    // Fallback to hardcoded data
    const hardcodedGames = getHardcodedGames();
    
    // Apply pagination
    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedGames = hardcodedGames.slice(startIndex, endIndex);
    
    console.log(`Returning ${paginatedGames.length} hardcoded games`);
    
    // Create a response object in the expected format
    const response = {
      games: paginatedGames,
      total: hardcodedGames.length,
      next: endIndex < hardcodedGames.length,
      previous: offset > 0
    };
    
    // Cache the fallback data
    gameCache.popular = {
      data: response,
      timestamp: Date.now()
    };
    
    return response;
  }
}

/**
 * Get recent games
 * @async
 * @function getRecentGames
 * @param {Object} [options={}] - Options for the request
 * @param {number} [options.limit=10] - Maximum number of games to return
 * @param {number} [options.offset=0] - Number of games to skip
 * @param {boolean} [options.forceRefresh=false] - Whether to force a refresh from the API
 * @returns {Promise<Object>} Object containing games and pagination info
 */
export async function getRecentGames({
  limit = 10,
  offset = 0,
  forceRefresh = false
} = {}) {
  // Check cache if no refresh is forced
  if (!forceRefresh && 
      gameCache.recent.data && 
      Date.now() - gameCache.recent.timestamp < gameCache.cacheExpiry) {
    return gameCache.recent.data;
  }

  try {
    const response = await apiClient.get(GAME_ENDPOINTS.recent, {
      params: { limit, offset }
    });
    
    // Update cache
    gameCache.recent = {
      data: response,
      timestamp: Date.now()
    };
    
    return response;
  } catch (error) {
    console.error('Error fetching recent games:', error);
    console.log('Falling back to hardcoded games data');
    
    // Fallback to hardcoded data
    const hardcodedResponse = getGamesLikeApi({
      ordering: '-released',
      page: Math.floor(offset / limit) + 1,
      pageSize: limit
    });
    
    return {
      games: hardcodedResponse.results,
      total: hardcodedResponse.count,
      next: hardcodedResponse.next ? true : false,
      previous: hardcodedResponse.previous ? true : false
    };
  }
}

/**
 * Search for games
 * @async
 * @function searchGames
 * @param {string} query - Search query
 * @param {Object} [options={}] - Options for the request
 * @param {number} [options.limit=10] - Maximum number of games to return
 * @param {number} [options.offset=0] - Number of games to skip
 * @returns {Promise<Object>} Object containing games and pagination info
 */
export async function searchGames(query, {
  limit = 10,
  offset = 0
} = {}) {
  try {
    return await apiClient.get(GAME_ENDPOINTS.search, {
      params: { q: query, limit, offset }
    });
  } catch (error) {
    console.error('Error searching games:', error);
    console.log('Falling back to hardcoded games data');
    
    // Fallback to hardcoded data
    const hardcodedResponse = getGamesLikeApi({
      search: query,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit
    });
    
    return {
      games: hardcodedResponse.results,
      total: hardcodedResponse.count,
      next: hardcodedResponse.next ? true : false,
      previous: hardcodedResponse.previous ? true : false
    };
  }
}

/**
 * Get game details by ID
 * @async
 * @function getGameById
 * @param {string|number} gameId - ID of the game to fetch
 * @param {boolean} [forceRefresh=false] - Whether to force a refresh from the API
 * @returns {Promise<Object>} Game details
 */
export async function getGameById(gameId, forceRefresh = false) {
  // Check cache if no refresh is forced
  if (!forceRefresh && 
      gameCache.details[gameId] && 
      Date.now() - gameCache.details[gameId].timestamp < gameCache.cacheExpiry) {
    return gameCache.details[gameId].data;
  }

  try {
    const response = await apiClient.get(GAME_ENDPOINTS.game(gameId));
    
    // Update cache
    gameCache.details[gameId] = {
      data: response,
      timestamp: Date.now()
    };
    
    return response;
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    console.log('Falling back to hardcoded games data');
    
    // Fallback to hardcoded data
    const allGames = getHardcodedGames();
    const game = allGames.find(g => g.id.toString() === gameId.toString());
    
    if (game) {
      return game;
    }
    
    throw new Error(`Game with ID ${gameId} not found`);
  }
}

/**
 * Get reviews for a game
 * @async
 * @function getGameReviews
 * @param {string|number} gameId - ID of the game to fetch reviews for
 * @param {Object} [options={}] - Options for the request
 * @param {number} [options.limit=10] - Maximum number of reviews to return
 * @param {number} [options.offset=0] - Number of reviews to skip
 * @param {boolean} [options.forceRefresh=false] - Whether to force a refresh from the API
 * @returns {Promise<Array>} Array of reviews
 */
export async function getGameReviews(gameId, {
  limit = 10,
  offset = 0,
  forceRefresh = false
} = {}) {
  // Check cache if no refresh is forced
  if (!forceRefresh && 
      gameCache.reviews[gameId] && 
      Date.now() - gameCache.reviews[gameId].timestamp < gameCache.cacheExpiry) {
    return gameCache.reviews[gameId].data.reviews || [];
  }

  try {
    // Get reviews from proxy endpoint
    const response = await fetch(`/api/proxy/reviews/game/${gameId}`);
    
    if (!response.ok) {
      throw new Error(`Backend API returned status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update cache
    gameCache.reviews[gameId] = {
      data: data,
      timestamp: Date.now()
    };
    
    console.log(`Fetched ${data.reviews?.length || 0} reviews from backend API for game ${gameId}`);
    return data.reviews || [];
  } catch (error) {
    console.error(`Error fetching reviews for game ${gameId}:`, error);
    
    // Fallback to frontend API for now
    try {
      const response = await apiClient.get(GAME_ENDPOINTS.reviews(gameId), {
        params: { limit, offset }
      });
      
      return response.reviews || [];
    } catch (fallbackError) {
      console.error(`Fallback also failed:`, fallbackError);
      return [];
    }
  }
}

/**
 * Create or update a review for a game
 * @async
 * @function createOrUpdateReview
 * @param {string|number} gameId - ID of the game to review
 * @param {Object} reviewData - Review data
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.content - Review content
 * @returns {Promise<Object>} Created or updated review
 */
export async function createOrUpdateReview(gameId, { rating, content }) {
  try {
    console.log(`Attempting to create/update review for game ${gameId} with rating ${rating} and content length ${content.length}`);
    
    // Get auth token if available
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Auth token found, adding to request headers');
    } else {
      console.log('No auth token found, proceeding as anonymous user');
    }
    
    // First try the direct endpoint without proxy
    try {
      console.log(`Sending review directly to /games/${gameId}/reviews endpoint`);
      const directResponse = await fetch(`/games/${gameId}/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rating,
          content
        })
      });
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        console.log(`Review successfully submitted directly:`, data);
        
        // Clear cache for this game's reviews
        delete gameCache.reviews[gameId];
        
        return data;
      } else {
        const errorText = await directResponse.text();
        console.error(`Direct endpoint returned error (${directResponse.status}):`, errorText);
        throw new Error(`Failed to submit review (${directResponse.status}): ${errorText}`);
      }
    } catch (directError) {
      console.warn(`Direct endpoint failed, trying proxy endpoint:`, directError);
      
      // If direct endpoint fails, try the proxy endpoint
      const proxyResponse = await fetch(`/api/proxy/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          gameId,
          rating,
          content
        })
      });
      
      if (!proxyResponse.ok) {
        const errorData = await proxyResponse.json();
        throw new Error(errorData.error || `Failed to create review (${proxyResponse.status})`);
      }
      
      const data = await proxyResponse.json();
      
      // Clear cache for this game's reviews
      delete gameCache.reviews[gameId];
      
      console.log(`Successfully created review via proxy for game ${gameId}`);
      return data;
    }
  } catch (error) {
    console.error(`Error creating/updating review for game ${gameId}:`, error);
    
    // Fallback to frontend API for now
    try {
      console.log(`Trying fallback to apiClient.post for review submission`);
      const response = await apiClient.post(GAME_ENDPOINTS.reviews(gameId), {
        rating: Number(rating),
        content
      });
      
      // Clear cache for this game's reviews
      delete gameCache.reviews[gameId];
      
      console.log(`Successfully created review via fallback for game ${gameId}`);
      return response;
    } catch (fallbackError) {
      console.error(`All review submission methods failed:`, fallbackError);
      throw error;
    }
  }
}

/**
 * Delete a review
 * @async
 * @function deleteReview
 * @param {string|number} reviewId - ID of the review to delete
 * @returns {Promise<void>}
 */
export async function deleteReview(reviewId) {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required to delete a review');
    }
    
    const response = await fetch(`/api/proxy/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete review (${response.status})`);
    }
    
    // Clear all game reviews cache as we don't know which game this was for
    gameCache.reviews = {};
    
    console.log(`Successfully deleted review ${reviewId} from backend database`);
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    
    // Fallback to frontend API for now
    try {
      await apiClient.delete(GAME_ENDPOINTS.review(reviewId));
      
      // Clear all game reviews cache
      gameCache.reviews = {};
    } catch (fallbackError) {
      console.error(`Fallback also failed:`, fallbackError);
      throw error;
    }
  }
}

/**
 * Get reviews by the current user
 * @async
 * @function getMyReviews
 * @param {Object} [options={}] - Options for the request
 * @param {number} [options.limit=10] - Maximum number of reviews to return
 * @param {number} [options.offset=0] - Number of reviews to skip
 * @param {boolean} [options.forceRefresh=false] - Whether to force a refresh from the API
 * @returns {Promise<Object>} Object containing reviews and pagination info
 */
export async function getMyReviews({
  limit = 10,
  offset = 0,
  forceRefresh = false
} = {}) {
  try {
    return await apiClient.get(GAME_ENDPOINTS.myReviews, {
      params: { limit, offset }
    });
  } catch (error) {
    console.error('Error fetching my reviews:', error);
    console.log('Falling back to empty reviews data');
    
    // Fallback to empty reviews data
    return {
      reviews: [],
      total: 0,
      next: false,
      previous: false
    };
  }
}

/**
 * Get reviews by a specific user
 * @async
 * @function getUserReviews
 * @param {string|number} userId - ID of the user to fetch reviews for
 * @param {Object} [options={}] - Options for the request
 * @param {number} [options.limit=10] - Maximum number of reviews to return
 * @param {number} [options.offset=0] - Number of reviews to skip
 * @returns {Promise<Object>} Object containing reviews and pagination info
 */
export async function getUserReviews(userId, {
  limit = 10,
  offset = 0
} = {}) {
  try {
    return await apiClient.get(GAME_ENDPOINTS.userReviews(userId), {
      params: { limit, offset }
    });
  } catch (error) {
    console.error(`Error fetching reviews for user ${userId}:`, error);
    console.log('Falling back to empty reviews data');
    
    // Fallback to empty reviews data
    return {
      reviews: [],
      total: 0,
      next: false,
      previous: false
    };
  }
}

/**
 * Clear the game cache
 * @function clearGameCache
 * @param {string} [cacheType='all'] - Type of cache to clear ('all', 'popular', 'recent', 'details', 'reviews')
 * @param {string|number} [id] - ID of the specific game to clear (for 'details' or 'reviews')
 */
export function clearGameCache(cacheType = 'all', id = null) {
  switch (cacheType) {
    case 'popular':
      gameCache.popular = { data: null, timestamp: 0 };
      break;
    case 'recent':
      gameCache.recent = { data: null, timestamp: 0 };
      break;
    case 'details':
      if (id) {
        delete gameCache.details[id];
      } else {
        gameCache.details = {};
      }
      break;
    case 'reviews':
      if (id) {
        delete gameCache.reviews[id];
      } else {
        gameCache.reviews = {};
      }
      break;
    case 'all':
    default:
      gameCache.popular = { data: null, timestamp: 0 };
      gameCache.recent = { data: null, timestamp: 0 };
      gameCache.games = { data: null, timestamp: 0 };
      gameCache.details = {};
      gameCache.reviews = {};
      break;
  }
}

/**
 * Get ratings for all games
 * @async
 * @function getGameRatings
 * @returns {Promise<Array>} Array of game ratings
 */
export async function getGameRatings() {
  try {
    const response = await apiClient.get(GAME_ENDPOINTS.ratings);
    return response;
  } catch (error) {
    console.error('Error fetching game ratings:', error);
    console.log('Falling back to hardcoded ratings data');
    
    // Generate ratings from hardcoded games
    const hardcodedGames = getHardcodedGames();
    return hardcodedGames.map(game => ({
      game_id: game.id.toString(),
      average_rating: ((game.metacritic || 0) / 20).toFixed(1), // Convert 0-100 to 0-5
      rating_count: game.ratings_count || Math.floor(Math.random() * 100) + 5
    }));
  }
}

/**
 * Get games with fallback to hardcoded data if API fails
 * @async
 * @function getGamesWithFallback
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Games response
 */
export async function getGamesWithFallback(options = {}) {
  try {
    // First try to get games from the API
    const response = await getGames(options);
    console.log('Successfully fetched games from API');
    return response;
  } catch (error) {
    console.warn('Failed to fetch games from API, using hardcoded data fallback:', error);
    
    // Import the hardcoded games data
    const { getGamesLikeApi } = await import('../hardcoded-games.js');
    
    // Get hardcoded games with the same options format
    return getGamesLikeApi(options);
  }
}

/**
 * Search games with fallback to hardcoded data if API fails
 * @async
 * @function searchGamesWithFallback
 * @param {string} query - Search query
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Search results
 */
export async function searchGamesWithFallback(query, options = {}) {
  try {
    // First try to search games from the API
    const response = await searchGames(query, options);
    console.log('Successfully searched games from API');
    return response;
  } catch (error) {
    console.warn('Failed to search games from API, using hardcoded data fallback:', error);
    
    // Import the hardcoded games data
    const { getGamesLikeApi } = await import('../hardcoded-games.js');
    
    // Search in hardcoded games
    return getGamesLikeApi({
      ...options,
      search: query
    });
  }
}

/**
 * Games service object with all game-related methods
 */
export const gamesService = {
  getPopularGames,
  getRecentGames,
  searchGames,
  getGameById,
  getGameReviews,
  createOrUpdateReview,
  deleteReview,
  getMyReviews,
  getUserReviews,
  clearGameCache,
  getGameRatings,
  getGamesWithFallback,
  searchGamesWithFallback
}; 