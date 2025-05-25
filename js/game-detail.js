/**
 * Game Detail Page
 * Handles loading and displaying game details and reviews
 */

class GameDetail {
  constructor() {
    this.gameId = this.getGameIdFromUrl();
    this.gameContainer = document.getElementById('game-detail');
    this.reviewsContainer = document.getElementById('reviews-container');
    this.errorContainer = document.getElementById('error-container');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.reviewForm = document.getElementById('review-form');
    
    // Review form elements
    this.ratingInput = document.getElementById('rating');
    this.reviewTextInput = document.getElementById('review-text');
    this.submitReviewBtn = document.getElementById('submit-review');
  }

  init() {
    this.loadGameDetails();
    this.loadGameReviews();
    
    if (this.reviewForm) {
      this.reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
    }
  }

  getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  async loadGameDetails() {
    if (!this.gameId) {
      this.showError('Game ID not found in URL');
      return;
    }

    this.setLoading(true);
    try {
      const response = await fetch(`/api/games/${this.gameId}`);
      if (!response.ok) {
        throw new Error(`Failed to load game details: ${response.statusText}`);
      }

      const gameData = await response.json();
      this.renderGameDetails(gameData);
    } catch (error) {
      console.error('Error loading game details:', error);
      this.showError(`Failed to load game details: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  async loadGameReviews() {
    if (!this.gameId) return;

    try {
      const response = await fetch(`/api/games/${this.gameId}/reviews`);
      if (!response.ok) {
        throw new Error(`Failed to load reviews: ${response.statusText}`);
      }

      const reviews = await response.json();
      this.renderReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Don't show error for reviews, just log it
    }
  }

  renderGameDetails(game) {
    if (!this.gameContainer) return;

    // Create game detail HTML
    const gameHTML = `
      <div class="game-header">
        <div class="game-cover">
          <img src="${game.coverUrl || '/images/fallback-logo.png'}" alt="${game.title}" class="game-cover-img">
        </div>
        <div class="game-info">
          <h1 class="game-title">${game.title}</h1>
          <div class="game-meta">
            <span class="game-year">${game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'Unknown'}</span>
            <span class="game-developer">${game.developer || 'Unknown Developer'}</span>
            <span class="game-publisher">${game.publisher || 'Unknown Publisher'}</span>
          </div>
          <div class="game-rating">
            <span class="rating-value">${game.averageRating ? game.averageRating.toFixed(1) : 'N/A'}</span>
            <span class="rating-count">${game.reviewCount || 0} reviews</span>
          </div>
          <div class="game-genres">
            ${game.genres ? game.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('') : ''}
          </div>
        </div>
      </div>
      <div class="game-description">
        <h2>About</h2>
        <p>${game.description || 'No description available.'}</p>
      </div>
    `;

    this.gameContainer.innerHTML = gameHTML;
  }

  renderReviews(reviews) {
    if (!this.reviewsContainer) return;

    if (!reviews || reviews.length === 0) {
      this.reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this game!</p>';
      return;
    }

    const reviewsHTML = reviews.map(review => `
      <div class="review-card">
        <div class="review-header">
          <span class="review-author">${review.username}</span>
          <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
          <div class="review-rating">${review.rating}/5</div>
        </div>
        <div class="review-content">
          <p>${review.content || ''}</p>
        </div>
      </div>
    `).join('');

    this.reviewsContainer.innerHTML = reviewsHTML;
  }

  async handleReviewSubmit(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      this.showError('You must be logged in to submit a review');
      return;
    }

    const rating = parseInt(this.ratingInput.value);
    const content = this.reviewTextInput.value;

    if (isNaN(rating) || rating < 1 || rating > 5) {
      this.showError('Please select a rating between 1 and 5');
      return;
    }

    this.setLoading(true);
    
    try {
      const response = await fetch(`/api/games/${this.gameId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, content })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.statusText}`);
      }

      // Refresh reviews after successful submission
      this.loadGameReviews();
      this.reviewForm.reset();
      this.showSuccess('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      this.showError(`Failed to submit review: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  showError(message) {
    if (!this.errorContainer) return;
    
    this.errorContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    this.errorContainer.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      this.errorContainer.style.display = 'none';
    }, 5000);
  }

  showSuccess(message) {
    if (!this.errorContainer) return;
    
    this.errorContainer.innerHTML = `<div class="alert alert-success">${message}</div>`;
    this.errorContainer.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
      this.errorContainer.style.display = 'none';
    }, 3000);
  }

  setLoading(isLoading) {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
    
    if (this.submitReviewBtn) {
      this.submitReviewBtn.disabled = isLoading;
    }
  }
}

// Initialize the game detail page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const gameDetail = new GameDetail();
  gameDetail.init();
}); 