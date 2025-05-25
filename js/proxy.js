// proxy.js - A proxy for RAWG API to avoid CORS issues

// Get your API key from https://rawg.io/apidocs
const RAWG_API_KEY = '2df6eeff39a04d68812bcbf8fd0ccae5';
const BASE_URL = 'https://api.rawg.io/api';

// Use allorigins.win as a CORS proxy
const PROXY_URL = 'https://api.allorigins.win/get?url=';

/**
 * Fetch data from RAWG API through a CORS proxy
 * @param {string} endpoint - API endpoint (e.g., 'games')
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Promise with response data
 */
async function fetchFromProxy(endpoint, params = {}) {
  try {
    // Add API key to params
    params.key = RAWG_API_KEY;
    
    // Build query string
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    // Build URL
    const apiUrl = `${BASE_URL}/${endpoint}?${queryString}`;
    console.log('Original API URL:', apiUrl);
    
    // Encode the URL for the proxy
    const proxyUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;
    console.log('Proxied URL:', proxyUrl);
    
    // Fetch through proxy
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
    }
    
    const proxyData = await response.json();
    
    // The actual data is in the 'contents' field, as a string
    if (proxyData.contents) {
      try {
        const parsedData = JSON.parse(proxyData.contents);
        
        // For games endpoint, ensure results property exists
        if (endpoint === 'games' && !parsedData.results) {
          console.error('Invalid API response format:', parsedData);
          
          // Create a proper format if missing
          return {
            count: 0,
            next: null,
            previous: null,
            results: []
          };
        }
        
        return parsedData;
      } catch (parseError) {
        console.error('Error parsing proxy contents:', parseError);
        throw new Error('Failed to parse API response: ' + parseError.message);
      }
    } else {
      console.error('Invalid proxy response:', proxyData);
      throw new Error('Invalid proxy response format - missing contents property');
    }
  } catch (error) {
    console.error('Error fetching through proxy:', error);
    throw error;
  }
}

/**
 * Fetch a list of games
 * @param {Object} options - Query parameters
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.pageSize - Number of games per page (default: 12)
 * @param {string} options.search - Search term (optional)
 * @param {string} options.ordering - Ordering field (optional)
 * @returns {Promise<Object>} Promise with games data
 */
async function fetchGames(options = {}) {
  const params = {
    page: options.page || 1,
    page_size: options.pageSize || 12,
    ordering: options.ordering || '-rating'
  };
  
  if (options.search) {
    params.search = options.search;
  }
  
  return fetchFromProxy('games', params);
}

/**
 * Fetch a single game's details
 * @param {number} gameId - The ID of the game to fetch
 * @returns {Promise<Object>} Promise with game data
 */
async function fetchGameDetails(gameId) {
  return fetchFromProxy(`games/${gameId}`);
}

/**
 * Fetch screenshots for a game
 * @param {number} gameId - The ID of the game
 * @returns {Promise<Object>} Promise with screenshots data
 */
async function fetchGameScreenshots(gameId) {
  return fetchFromProxy(`games/${gameId}/screenshots`);
}

// Export the functions
export {
  fetchGames,
  fetchGameDetails,
  fetchGameScreenshots
}; 