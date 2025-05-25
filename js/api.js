/**
 * API Compatibility Layer
 * 
 * This file provides backward compatibility with the old API structure.
 * It redirects calls from the old API to the new modular API structure.
 * This allows for a gradual transition to the new API without breaking existing code.
 */

import { gamesService } from './api/games.js';
import { authService } from './api/auth.js';

/**
 * API URL constants for backward compatibility
 */
export const API_URL = 'https://api.gametrackr.com';
export const GAMES_API_URL = `${API_URL}/games`;
export const USERS_API_URL = `${API_URL}/users`;

/**
 * Get games from the API with fallback to hardcoded data
 * @async
 * @function getGames
 * @param {Object} options - Query options (page, pageSize, sort, etc.)
 * @returns {Promise<Object>} Games data
 */
export async function getGames(options = {}) {
  console.log('[API Compatibility] Redirecting getGames() to new API structure');
  try {
    return await gamesService.getGamesWithFallback(options);
  } catch (error) {
    console.error('[API Compatibility] Error in getGames:', error);
    throw error;
  }
}

/**
 * Search for games by name
 * @async
 * @function searchGames
 * @param {string} query - Search query
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Search results
 */
export async function searchGames(query, options = {}) {
  console.log('[API Compatibility] Redirecting searchGames() to new API structure');
  try {
    return await gamesService.searchGamesWithFallback(query, options);
        } catch (error) {
    console.error('[API Compatibility] Error in searchGames:', error);
    throw error;
  }
}

/**
 * Get a specific game by ID
 * @async
 * @function getGameById
 * @param {string|number} id - Game ID
 * @returns {Promise<Object>} Game data
 */
export async function getGameById(id) {
  console.log('[API Compatibility] Redirecting getGameById() to new API structure');
  try {
    return await gamesService.getGameById(id);
  } catch (error) {
    console.error('[API Compatibility] Error in getGameById:', error);
    throw error;
  }
}

/**
 * Get user's game collection
 * @async
 * @function getUserGames
 * @param {string} userId - User ID (defaults to current user)
 * @returns {Promise<Array>} User's games
 */
export async function getUserGames(userId) {
  console.log('[API Compatibility] Redirecting getUserGames() to new API structure');
  try {
    return await gamesService.getUserGames(userId);
        } catch (error) {
    console.error('[API Compatibility] Error in getUserGames:', error);
    throw error;
  }
}

/**
 * Add a game to user's collection
 * @async
 * @function addGameToCollection
 * @param {string|number} gameId - Game ID to add
 * @param {Object} status - Game status (completed, playing, etc.)
 * @returns {Promise<Object>} Result of the operation
 */
export async function addGameToCollection(gameId, status) {
  console.log('[API Compatibility] Redirecting addGameToCollection() to new API structure');
  try {
    return await gamesService.addGameToCollection(gameId, status);
  } catch (error) {
    console.error('[API Compatibility] Error in addGameToCollection:', error);
    throw error;
  }
}

/**
 * Remove a game from user's collection
 * @async
 * @function removeGameFromCollection
 * @param {string|number} gameId - Game ID to remove
 * @returns {Promise<Object>} Result of the operation
 */
export async function removeGameFromCollection(gameId) {
  console.log('[API Compatibility] Redirecting removeGameFromCollection() to new API structure');
  try {
    return await gamesService.removeGameFromCollection(gameId);
  } catch (error) {
    console.error('[API Compatibility] Error in removeGameFromCollection:', error);
    throw error;
  }
}

/**
 * Get current authenticated user
 * @async
 * @function getCurrentUser
 * @returns {Promise<Object|null>} Current user or null if not authenticated
 */
export async function getCurrentUser() {
  console.log('[API Compatibility] Redirecting getCurrentUser() to new API structure');
  try {
    return await authService.getCurrentUser();
  } catch (error) {
    console.error('[API Compatibility] Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Login user with credentials
 * @async
 * @function login
 * @param {Object} credentials - User credentials (username/email and password)
 * @returns {Promise<Object>} Authentication result
 */
export async function login(credentials) {
  console.log('[API Compatibility] Redirecting login() to new API structure');
  try {
    return await authService.login(credentials);
  } catch (error) {
    console.error('[API Compatibility] Error in login:', error);
    throw error;
    }
}

/**
 * Register a new user
 * @async
 * @function register
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result
 */
export async function register(userData) {
  console.log('[API Compatibility] Redirecting register() to new API structure');
  try {
    return await authService.register(userData);
  } catch (error) {
    console.error('[API Compatibility] Error in register:', error);
    throw error;
  }
}

/**
 * Register a new user locally (no server API)
 * @async
 * @function registerLocal
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result
 */
export async function registerLocal(userData) {
  console.log('[API Compatibility] Redirecting registerLocal() to new API structure');
  try {
    return await authService.registerLocal(userData);
  } catch (error) {
    console.error('[API Compatibility] Error in registerLocal:', error);
    throw error;
  }
}

/**
 * Logout current user
 * @async
 * @function logout
 * @returns {Promise<void>}
 */
export async function logout() {
  console.log('[API Compatibility] Redirecting logout() to new API structure');
  try {
    return await authService.logout();
  } catch (error) {
    console.error('[API Compatibility] Error in logout:', error);
    throw error;
  }
}

/**
 * Fetch games with optional filters
 * @param {Object} options - Options for filtering games
 * @returns {Promise<Array>} Array of games
 */
export async function fetchGames(options = {}) {
  console.log('Redirecting fetchGames to new API structure');
  try {
    const response = await gamesService.getPopularGames({
      limit: options.limit || 20,
      offset: options.offset || 0
    });
    
    // Handle both API response format and hardcoded fallback format
    return response.games || response.results || response;
  } catch (error) {
    console.error('Error in fetchGames:', error);
    return [];
  }
}

/**
 * Fetch game details by ID
 * @param {string|number} gameId - ID of the game to fetch
 * @returns {Promise<Object>} Game details
 */
export async function fetchGameDetails(gameId) {
  console.log(`Redirecting fetchGameDetails(${gameId}) to new API structure`);
  try {
    return await gamesService.getGameById(gameId);
  } catch (error) {
    console.error(`Error in fetchGameDetails(${gameId}):`, error);
    return null;
  }
}

/**
 * Fetch game screenshots
 * @param {string|number} gameId - ID of the game to fetch screenshots for
 * @returns {Promise<Array>} Array of screenshot objects
 */
export async function fetchGameScreenshots(gameId) {
  console.log(`Redirecting fetchGameScreenshots(${gameId}) to new API structure`);
  try {
    const game = await gamesService.getGameById(gameId);
    return game.screenshots || [];
  } catch (error) {
    console.error(`Error in fetchGameScreenshots(${gameId}):`, error);
    return [];
  }
}

/**
 * Transform game data for display
 * @param {Object} game - Game object to transform
 * @returns {Object} Transformed game object
 */
export function transformGameData(game) {
  if (!game) return null;
  
  return {
    ...game,
    // Ensure these properties exist with fallbacks
    name: game.name || game.title || 'Unknown Game',
    background_image: game.background_image || game.cover_url || './assets/images/placeholder.jpg',
    released: game.released || game.release_date || 'Unknown',
    rating: game.rating || game.metacritic || 0,
    genres: game.genres || [],
    platforms: game.platforms || [],
    description: game.description || 'No description available'
  };
}

/**
 * Login user with local credentials (no server API)
 * @async
 * @function loginLocal
 * @param {Object} credentials - User credentials (username and password)
 * @returns {Promise<Object>} Authentication result
 */
export async function loginLocal(credentials) {
  console.log('[API Compatibility] Redirecting loginLocal() to new API structure');
  try {
    return await authService.loginLocal(credentials);
  } catch (error) {
    console.error('[API Compatibility] Error in loginLocal:', error);
    throw error;
  }
}

/**
 * Get popular games
 * @async
 * @function getPopularGames
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Popular games
 */
export async function getPopularGames(options = {}) {
  console.log('[API Compatibility] Redirecting getPopularGames() to new API structure');
  try {
    return await gamesService.getPopularGames(options);
  } catch (error) {
    console.error('[API Compatibility] Error in getPopularGames:', error);
    
    // Fallback to hardcoded data if API fails
    console.warn('[API Compatibility] Falling back to hardcoded games for popular games');
    const { getHardcodedGames } = await import('./hardcoded-games.js');
    return getHardcodedGames().slice(0, 10);
  }
}

/**
 * Get game reviews
 * @async
 * @function getGameReviews
 * @param {string|number} gameId - Game ID
 * @returns {Promise<Array>} Game reviews
 */
export async function getGameReviews(gameId) {
  console.log('[API Compatibility] Redirecting getGameReviews() to new API structure');
  try {
    return await gamesService.getGameReviews(gameId);
  } catch (error) {
    console.error('[API Compatibility] Error in getGameReviews:', error);
    // Return empty array if API fails
    return [];
  }
}

/**
 * Add a review for a game
 * @async
 * @function addReview
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object>} New review
 */
export async function addReview(reviewData) {
  console.log('[API Compatibility] Redirecting addReview() to new API structure');
  try {
    return await gamesService.addReview(reviewData);
  } catch (error) {
    console.error('[API Compatibility] Error in addReview:', error);
    throw error;
  }
}

/**
 * Get user reviews
 * @async
 * @function getUserReviews
 * @param {string} userId - User ID (defaults to current user)
 * @returns {Promise<Array>} User reviews
 */
export async function getUserReviews(userId) {
  console.log('[API Compatibility] Redirecting getUserReviews() to new API structure');
  try {
    return await gamesService.getUserReviews(userId);
  } catch (error) {
    console.error('[API Compatibility] Error in getUserReviews:', error);
    // Return empty array if API fails
    return [];
  }
}

/**
 * Get games by platform
 * @async
 * @function getGamesByPlatform
 * @param {string|number} platformId - Platform ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Games response
 */
export async function getGamesByPlatform(platformId, options = {}) {
  console.log('[API Compatibility] Redirecting getGamesByPlatform() to new API structure');
  try {
    return await gamesService.getGamesByPlatform(platformId, options);
  } catch (error) {
    console.error('[API Compatibility] Error in getGamesByPlatform:', error);
    
    // Fallback to hardcoded data if API fails
    console.warn('[API Compatibility] Falling back to hardcoded games for platform filtering');
    const { getGamesLikeApi } = await import('./hardcoded-games.js');
    return getGamesLikeApi({ 
      ...options,
      platforms: platformId
    });
  }
}

/**
 * Get games by genre
 * @async
 * @function getGamesByGenre
 * @param {string|number} genreId - Genre ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Games response
 */
export async function getGamesByGenre(genreId, options = {}) {
  console.log('[API Compatibility] Redirecting getGamesByGenre() to new API structure');
  try {
    return await gamesService.getGamesByGenre(genreId, options);
  } catch (error) {
    console.error('[API Compatibility] Error in getGamesByGenre:', error);
    
    // Fallback to hardcoded data if API fails
    console.warn('[API Compatibility] Falling back to hardcoded games for genre filtering');
    const { getGamesLikeApi } = await import('./hardcoded-games.js');
    return getGamesLikeApi({ 
      ...options,
      genres: genreId
    });
  }
}

/**
 * Get all available platforms
 * @async
 * @function getPlatforms
 * @returns {Promise<Array>} Platforms
 */
export async function getPlatforms() {
  console.log('[API Compatibility] Redirecting getPlatforms() to new API structure');
  try {
    return await gamesService.getPlatforms();
  } catch (error) {
    console.error('[API Compatibility] Error in getPlatforms:', error);
    
    // Extract platforms from hardcoded games if API fails
    console.warn('[API Compatibility] Falling back to hardcoded data for platforms');
    const { getHardcodedGames } = await import('./hardcoded-games.js');
    const games = getHardcodedGames();
    
    // Extract unique platforms from games
    const platformsMap = new Map();
    games.forEach(game => {
      if (game.platforms && Array.isArray(game.platforms)) {
        game.platforms.forEach(platform => {
          if (platform.platform && platform.platform.id) {
            platformsMap.set(platform.platform.id, platform.platform);
          }
        });
      }
    });
    
    return Array.from(platformsMap.values());
  }
}

/**
 * Get all available genres
 * @async
 * @function getGenres
 * @returns {Promise<Array>} Genres
 */
export async function getGenres() {
  console.log('[API Compatibility] Redirecting getGenres() to new API structure');
  try {
    return await gamesService.getGenres();
  } catch (error) {
    console.error('[API Compatibility] Error in getGenres:', error);
    
    // Extract genres from hardcoded games if API fails
    console.warn('[API Compatibility] Falling back to hardcoded data for genres');
    const { getHardcodedGames } = await import('./hardcoded-games.js');
    const games = getHardcodedGames();
    
    // Extract unique genres from games
    const genresMap = new Map();
    games.forEach(game => {
      if (game.genres && Array.isArray(game.genres)) {
        game.genres.forEach(genre => {
          if (genre.id) {
            genresMap.set(genre.id, genre);
          }
        });
      }
    });
    
    return Array.from(genresMap.values());
  }
} 