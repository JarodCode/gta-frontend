// reviews.js - Module for handling game reviews
import { getCurrentUser } from './auth.js';

// Get all reviews for a specific game
export function getGameReviews(gameId) {
  const allReviews = JSON.parse(localStorage.getItem('gameReviews') || '{}');
  return allReviews[gameId] || [];
}

// Get all reviews by a specific user
export function getUserReviews(userId) {
  const allReviews = JSON.parse(localStorage.getItem('gameReviews') || '{}');
  const userReviews = [];
  
  // Iterate through all game reviews to find reviews by this user
  Object.entries(allReviews).forEach(([gameId, reviews]) => {
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
export function addReview(gameId, content, rating, gameTitle, gameCoverUrl) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to write a review');
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
    content: content.substring(0, 50) + '...' // Log first 50 chars of content
  });
  
  const allReviews = JSON.parse(localStorage.getItem('gameReviews') || '{}');
  
  // Initialize game reviews array if it doesn't exist
  if (!allReviews[gameId]) {
    allReviews[gameId] = [];
  }
  
  // Check if user has already reviewed this game
  const existingReviewIndex = allReviews[gameId].findIndex(review => review.userId === user.id);
  
  const reviewObj = {
    id: Date.now().toString(),
    userId: user.id,
    username: user.username,
    content,
    rating: Number(rating), // Ensure rating is stored as a number
    gameTitle,
    gameCoverUrl,
    createdAt: new Date().toISOString()
  };
  
  if (existingReviewIndex >= 0) {
    // Update existing review
    allReviews[gameId][existingReviewIndex] = reviewObj;
  } else {
    // Add new review
    allReviews[gameId].push(reviewObj);
  }
  
  // Debug log
  console.log('Storing reviews for game:', {
    gameId,
    reviewCount: allReviews[gameId].length,
    reviews: allReviews[gameId]
  });
  
  localStorage.setItem('gameReviews', JSON.stringify(allReviews));
  
  // Update game ratings
  const updatedRating = updateGameRating(gameId);
  
  // Debug log
  console.log('Updated game rating:', {
    gameId,
    rating: updatedRating.rating,
    count: updatedRating.count
  });
  
  // Announce the new review via fake websocket event
  announceNewReview(gameId, reviewObj);
  
  return reviewObj;
}

// Delete a review
export function deleteReview(gameId, reviewId) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to delete a review');
  }
  
  const allReviews = JSON.parse(localStorage.getItem('gameReviews') || '{}');
  
  if (!allReviews[gameId]) {
    return false;
  }
  
  const reviewIndex = allReviews[gameId].findIndex(review => review.id === reviewId);
  
  if (reviewIndex === -1) {
    return false;
  }
  
  // Only allow users to delete their own reviews
  if (allReviews[gameId][reviewIndex].userId !== user.id) {
    throw new Error('You can only delete your own reviews');
  }
  
  // Remove the review
  allReviews[gameId].splice(reviewIndex, 1);
  
  localStorage.setItem('gameReviews', JSON.stringify(allReviews));
  
  // Update game ratings
  updateGameRating(gameId);
  
  return true;
}

/**
 * Initialize ratings for all games if they don't exist
 * @param {Array} games - Array of game objects
 */
function initializeGameRatings(games) {
  const gameRatings = JSON.parse(localStorage.getItem('gameRatings') || '{}');
  let hasChanges = false;

  // Add ratings for any new games
  games.forEach(game => {
    if (!gameRatings[game.id]) {
      gameRatings[game.id] = {
        rating: 0,
        count: 0
      };
      hasChanges = true;
    }
  });

  // Save changes if any new games were added
  if (hasChanges) {
    localStorage.setItem('gameRatings', JSON.stringify(gameRatings));
  }

  return gameRatings;
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
  
  // Get current ratings
  const gameRatings = JSON.parse(localStorage.getItem('gameRatings') || '{}');
  
  if (reviews.length === 0) {
    // If no reviews, set rating to 0 but keep the game in ratings
    gameRatings[gameId] = {
      rating: 0,
      count: 0
    };
  } else {
    // Calculate average rating from reviews
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const avg = sum / reviews.length;
    
    gameRatings[gameId] = {
      rating: Number(avg.toFixed(1)),
      count: reviews.length
    };
  }
  
  // Debug log
  console.log('Updating game rating:', {
    gameId,
    rating: gameRatings[gameId].rating,
    count: gameRatings[gameId].count,
    reviews
  });
  
  localStorage.setItem('gameRatings', JSON.stringify(gameRatings));
  return gameRatings[gameId];
}

// Get the average rating for a game
export function getGameRating(gameId) {
  const gameRatings = JSON.parse(localStorage.getItem('gameRatings') || '{}');
  const rating = gameRatings[gameId] || { rating: 0, count: 0 };
  
  // Debug log
  console.log('Getting game rating:', {
    gameId,
    rating: rating.rating,
    count: rating.count
  });
  
  return rating;
}

/**
 * Get all game ratings from localStorage
 * @returns {Object} Object containing game ratings
 */
export function getAllGameRatings() {
  const ratings = localStorage.getItem('gameRatings');
  if (!ratings) return {};
  
  try {
    const parsedRatings = JSON.parse(ratings);
    
    // Debug log
    console.log('All game ratings:', parsedRatings);
    
    // Transform the data to ensure consistent structure
    return Object.entries(parsedRatings).reduce((acc, [gameId, data]) => {
      acc[gameId] = {
        rating: Number(data.rating || 0),
        count: Number(data.count || 0)
      };
      return acc;
    }, {});
  } catch (error) {
    console.error('Error parsing game ratings:', error);
    return {};
  }
}

// Simulate a WebSocket connection for real-time updates
let reviewListeners = [];

// Register a callback for new review events
export function onNewReview(callback) {
  reviewListeners.push(callback);
  return () => {
    // Return a function to unregister the callback
    reviewListeners = reviewListeners.filter(cb => cb !== callback);
  };
}

// Announce a new review to all listeners
function announceNewReview(gameId, review) {
  // In a real app, this would be handled by a WebSocket connection
  reviewListeners.forEach(callback => {
    setTimeout(() => {
      callback({
        type: 'new_review',
        gameId,
        review
      });
    }, 0);
  });
} 