// Home page functionality

document.addEventListener('DOMContentLoaded', () => {
  const trendingGamesContainer = document.getElementById('trending-games-container');
  const recentReviewsContainer = document.getElementById('recent-reviews-container');
  const searchInput = document.getElementById('game-search');
  const searchBtn = document.getElementById('search-btn');
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('auth_token');
  
  // Update navigation based on login status
  updateNavigation(isLoggedIn);
  
  // Load trending games
  fetchTrendingGames();
  
  // Load recent reviews
  fetchRecentReviews();
  
  // Set up search functionality
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const searchQuery = searchInput.value.trim();
      if (searchQuery) {
        window.location.href = `/pages/search/?q=${encodeURIComponent(searchQuery)}`;
      }
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
          window.location.href = `/pages/search/?q=${encodeURIComponent(searchQuery)}`;
        }
      }
    });
  }
});

// Update navigation based on authentication status
function updateNavigation(isLoggedIn) {
  const nav = document.getElementById('main-nav');
  
  if (nav) {
    if (isLoggedIn) {
      // User is logged in
      nav.innerHTML = `
        <ul>
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/pages/dashboard/">My Games</a></li>
          <li><a href="/pages/profile/">Profile</a></li>
          <li><a href="#" id="logout-link">Logout</a></li>
        </ul>
      `;
      
      // Add logout functionality
      document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    } else {
      // User is not logged in
      nav.innerHTML = `
        <ul>
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/pages/login/">Login</a></li>
          <li><a href="/pages/register/">Register</a></li>
        </ul>
      `;
    }
  }
}

// Fetch trending games
async function fetchTrendingGames() {
  const container = document.getElementById('trending-games-container');
  
  if (!container) return;
  
  try {
    // In a real app, this would be a call to your backend API
    const response = await fetch('http://localhost:8000/games/trending');
    
    if (!response.ok) {
      // If API not ready, use mock data
      displayMockGames(container);
      return;
    }
    
    const games = await response.json();
    
    // Clear skeleton loaders
    container.innerHTML = '';
    
    // Display games
    games.forEach(game => {
      container.appendChild(createGameCard(game));
    });
  } catch (error) {
    console.error('Error fetching trending games:', error);
    // Show mock data if API fails
    displayMockGames(container);
  }
}

// Display mock games for development
function displayMockGames(container) {
  const mockGames = [
    { id: 1, title: 'Elden Ring', year: 2022, rating: 9.7, cover_image_url: 'https://via.placeholder.com/300x400?text=Elden+Ring' },
    { id: 2, title: 'God of War: Ragnarok', year: 2022, rating: 9.5, cover_image_url: 'https://via.placeholder.com/300x400?text=God+of+War' },
    { id: 3, title: 'Zelda: Tears of the Kingdom', year: 2023, rating: 9.8, cover_image_url: 'https://via.placeholder.com/300x400?text=Zelda:+TOTK' },
    { id: 4, title: 'Cyberpunk 2077', year: 2020, rating: 8.3, cover_image_url: 'https://via.placeholder.com/300x400?text=Cyberpunk+2077' }
  ];
  
  // Clear skeleton loaders
  container.innerHTML = '';
  
  // Display mock games
  mockGames.forEach(game => {
    container.appendChild(createGameCard(game));
  });
}

// Create a game card element
function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.innerHTML = `
    <div class="game-cover">
      <img src="${game.cover_image_url}" alt="${game.title}">
    </div>
    <div class="game-info">
      <h3 class="game-title">${game.title}</h3>
      <div class="game-meta">
        <span class="game-year">${game.year}</span>
        <span class="game-rating">★ ${game.rating.toFixed(1)}</span>
      </div>
    </div>
  `;
  
  // Add click event
  card.addEventListener('click', () => {
    window.location.href = `/pages/game/?id=${game.id}`;
  });
  
  return card;
}

// Fetch recent reviews
async function fetchRecentReviews() {
  const container = document.getElementById('recent-reviews-container');
  
  if (!container) return;
  
  try {
    // In a real app, this would be a call to your backend API
    const response = await fetch('http://localhost:8000/reviews/recent');
    
    if (!response.ok) {
      // If API not ready, use mock data
      displayMockReviews(container);
      return;
    }
    
    const reviews = await response.json();
    
    // Clear skeleton loaders
    container.innerHTML = '';
    
    // Display reviews
    reviews.forEach(review => {
      container.appendChild(createReviewCard(review));
    });
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    // Show mock data if API fails
    displayMockReviews(container);
  }
}

// Display mock reviews for development
function displayMockReviews(container) {
  const mockReviews = [
    {
      id: 1,
      user: { username: 'gamemaster42', avatar_url: 'https://via.placeholder.com/40x40' },
      game: { title: 'Elden Ring', id: 1 },
      rating: 9.5,
      content: 'One of the best games I\'ve ever played. The open world is breathtaking and the combat is challenging but fair.',
      date: '2023-10-15'
    },
    {
      id: 2,
      user: { username: 'rpgfan99', avatar_url: 'https://via.placeholder.com/40x40' },
      game: { title: 'Zelda: Tears of the Kingdom', id: 3 },
      rating: 10,
      content: 'Nintendo has outdone themselves again. The creativity in this game is unmatched and the gameplay mechanics are revolutionary.',
      date: '2023-10-12'
    }
  ];
  
  // Clear skeleton loaders
  container.innerHTML = '';
  
  // Display mock reviews
  mockReviews.forEach(review => {
    container.appendChild(createReviewCard(review));
  });
}

// Create a review card element
function createReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `
    <div class="review-header">
      <div class="user-avatar">
        <img src="${review.user.avatar_url}" alt="${review.user.username}">
      </div>
      <div class="review-user-info">
        <div class="review-username">${review.user.username}</div>
        <div class="review-game">${review.game.title}</div>
      </div>
      <div class="review-rating">★ ${review.rating.toFixed(1)}</div>
    </div>
    <div class="review-content">${review.content}</div>
    <div class="review-footer">
      <span class="review-date">${formatDate(review.date)}</span>
      <a href="/pages/game/?id=${review.game.id}" class="review-link">View Game</a>
    </div>
  `;
  
  return card;
}

// Format date to readable format
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Logout function
function logout() {
  // Clear auth token
  localStorage.removeItem('auth_token');
  
  // Call logout endpoint
  fetch('http://localhost:8000/logout', {
    method: 'POST',
    credentials: 'include'
  })
  .finally(() => {
    // Redirect to home page
    window.location.href = '/';
  });
} 