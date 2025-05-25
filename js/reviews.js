/**
 * Reviews Compatibility Layer
 * 
 * This module provides backward compatibility with the old reviews functions.
 * It redirects calls to the new modular API structure.
 * 
 * @module reviews
 */

import { gamesService } from './api/games.js';

/**
 * Get game reviews
 * @async
 * @function getGameReviews
 * @param {string|number} gameId - ID of the game to fetch reviews for
 * @param {Object} [options={}] - Options for the request
 * @returns {Promise<Object>} Object containing reviews and pagination info
 */
export async function getGameReviews(gameId, options = {}) {
  console.log(`Redirecting getGameReviews(${gameId}) to new API structure`);
  try {
    return await gamesService.getGameReviews(gameId, options);
  } catch (error) {
    console.error(`Error in getGameReviews(${gameId}):`, error);
    return { reviews: [], total: 0 };
  }
}

/**
 * Add a review for a game
 * @async
 * @function addReview
 * @param {string|number} gameId - ID of the game to review
 * @param {string} content - Review content
 * @param {number} rating - Rating (1-5)
 * @returns {Promise<Object>} Created review
 */
export async function addReview(gameId, content, rating) {
  console.log(`Redirecting addReview(${gameId}) to new API structure`);
  try {
    return await gamesService.createOrUpdateReview(gameId, { content, rating });
  } catch (error) {
    console.error(`Error in addReview(${gameId}):`, error);
    throw error;
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
  console.log(`Redirecting deleteReview(${reviewId}) to new API structure`);
  try {
    await gamesService.deleteReview(reviewId);
  } catch (error) {
    console.error(`Error in deleteReview(${reviewId}):`, error);
    throw error;
  }
}

/**
 * Get game rating statistics
 * @async
 * @function getGameRating
 * @param {string|number} gameId - ID of the game to fetch rating for
 * @returns {Promise<Object>} Rating statistics
 */
export async function getGameRating(gameId) {
  console.log(`Redirecting getGameRating(${gameId}) to new API structure`);
  try {
    const game = await gamesService.getGameById(gameId);
    return {
      average: game.avg_rating || 0,
      count: game.review_count || 0
    };
  } catch (error) {
    console.error(`Error in getGameRating(${gameId}):`, error);
    return { average: 0, count: 0 };
  }
}

/**
 * Get games sorted by user rating
 * @async
 * @function getGamesSortedByUserRating
 * @param {number} [limit=10] - Maximum number of games to return
 * @returns {Promise<Array>} Array of games sorted by user rating
 */
export async function getGamesSortedByUserRating(limit = 10) {
  console.log(`Redirecting getGamesSortedByUserRating(${limit}) to new API structure`);
  try {
    const response = await gamesService.getPopularGames({
      limit,
      ordering: '-avg_rating'
    });
    return response.games || response.results || [];
  } catch (error) {
    console.error(`Error in getGamesSortedByUserRating(${limit}):`, error);
    return [];
  }
}

/**
 * Add a listener for new reviews
 * @function onNewReview
 * @param {Function} callback - Callback to call when a new review is added
 * @returns {Function} Function to remove the listener
 */
export function onNewReview(callback) {
  console.log('Redirecting onNewReview to new API structure');
  // This is a stub since we don't have real-time functionality
  return () => {}; // Return a no-op cleanup function
}

/**
 * Fetch game reviews (alias for getGameReviews)
 * @async
 * @function fetchGameReviews
 * @param {string|number} gameId - ID of the game to fetch reviews for
 * @param {Object} [options={}] - Options for the request
 * @returns {Promise<Object>} Object containing reviews and pagination info
 */
export async function fetchGameReviews(gameId, options = {}) {
  return getGameReviews(gameId, options);
} 