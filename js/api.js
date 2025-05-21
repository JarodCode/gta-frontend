// api.js - Interface to the RAWG video games database API

// Import the hardcoded games data
import { getGamesLikeApi, getHardcodedGames } from './hardcoded-games.js';

// Get your API key from https://rawg.io/apidocs
const RAWG_API_KEY = 'c74a146fe31a47359e42174fd844b392'; 
const BASE_URL = 'https://api.rawg.io/api';

// Set up proxy configuration
const USE_PROXY = true; // Set to false to try direct fetch first
const PROXY_SERVICES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?', 
    'https://cors-anywhere.herokuapp.com/'
];
let currentProxyIndex = 0;

console.log('Game data API module loaded');

/**
 * Get the next proxy URL to try
 * @returns {string} The next proxy URL to use
 */
function getNextProxy() {
    const proxy = PROXY_SERVICES[currentProxyIndex];
    // Cycle through proxies for next request
    currentProxyIndex = (currentProxyIndex + 1) % PROXY_SERVICES.length;
    return proxy;
}

/**
 * Fetch data with automatic proxy fallback
 * @param {string} url - The URL to fetch data from
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Promise resolving to the data
 */
async function fetchWithFallback(url, options = {}) {
    console.log('Fetching game data from external API');
    
    // Try direct fetch first if proxy is disabled
    if (!USE_PROXY) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return await response.json();
            }
            // If direct fetch fails with CORS error, fall back to proxy
            console.log('Direct fetch failed, falling back to proxy');
        } catch (error) {
            console.log('Direct fetch error, trying proxy');
        }
    }
    
    // Try each proxy service until one works or all fail
    let lastError = null;
    
    // Try all proxies
    for (let i = 0; i < PROXY_SERVICES.length; i++) {
        const proxy = getNextProxy();
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        
        try {
            console.log('Trying proxy for game data');
            const response = await fetch(proxyUrl, options);
            
            if (!response.ok) {
                throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Successfully retrieved game data');
            return data;
        } catch (error) {
            lastError = error;
            console.error(`Error with proxy:`, error.message);
        }
    }
    
    // If all proxies failed, throw the last error
    throw lastError || new Error('All fetch attempts failed');
}

/**
 * Fetches games from the RAWG API
 * @param {Object} options - Options for the API request
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.pageSize - Number of games per page (default: 24)
 * @param {string} options.ordering - Ordering of results (default: '-rating')
 * @param {string} options.search - Search query (optional)
 * @param {string} options.genres - Genre ids (optional)
 * @returns {Promise<Object>} - Promise resolving to the API response
 */
async function fetchGames({ page = 1, pageSize = 24, ordering = '-rating', search = '', genres = '' } = {}) {
    console.log('Fetching games data for display with params:', { page, pageSize, ordering, search });
    
    // Use hardcoded data instead of API call
    return getGamesLikeApi({ page, pageSize, ordering, search, genres });
}

/**
 * Fetches details for a specific game
 * @param {number|string} gameId - ID of the game to fetch
 * @returns {Promise<Object>} - Promise resolving to the game details
 */
async function fetchGameDetails(gameId) {
    console.log(`Using hardcoded data for game ${gameId} details instead of API call`);
    
    // Get the game from our hardcoded data
    const games = getHardcodedGames();
    const game = games.find(g => g.id.toString() === gameId.toString());
    
    if (game) {
        console.log('Found game in hardcoded data:', game.name);
        return game;
    } else {
        console.warn('Game not found in hardcoded data, returning sample data');
        return getSampleGameDetails(gameId);
    }
}

/**
 * Fetches screenshots for a specific game
 * @param {number|string} gameId - ID of the game to fetch screenshots for
 * @returns {Promise<Array>} - Promise resolving to an empty array
 */
async function fetchGameScreenshots(gameId) {
    console.log(`Screenshots disabled as requested`);
    return [];
}

/**
 * Search for games by name
 * @param {string} searchTerm - The search term
 * @returns {Promise<Object>} Promise with search results
 */
async function searchGames(searchTerm) {
  try {
    console.log('Searching for games with term:', searchTerm);
    return await fetchGames({ search: searchTerm });
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
}

/**
 * Transform RAWG game list item to our application's format
 * @param {Object} rawgGame - Game data from RAWG API
 * @returns {Object} Transformed game data
 */
function transformGameData(rawgGame) {
  return {
    id: rawgGame.id,
    name: rawgGame.name,
    background_image: rawgGame.background_image,
    rating: rawgGame.rating,
    rating_count: rawgGame.ratings_count,
    released: rawgGame.released,
    developers: rawgGame.developers || [],
    publishers: rawgGame.publishers || [],
    platforms: rawgGame.platforms ? rawgGame.platforms.map(p => p.platform.name) : [],
    genres: rawgGame.genres ? rawgGame.genres.map(g => g.name) : [],
    description: rawgGame.description_raw || rawgGame.description || '',
    metacritic: rawgGame.metacritic
  };
}

/**
 * Transform RAWG detailed game data to our application's format
 * @param {Object} rawgGame - Detailed game data from RAWG API
 * @param {Array} screenshots - Screenshots for the game
 * @returns {Object} Transformed detailed game data
 */
function transformGameDetails(rawgGame, screenshots) {
  const tags = [];
  
  // Extract genres as tags
  if (rawgGame.genres) {
    rawgGame.genres.forEach(genre => {
      tags.push({ id: genre.id, name: genre.name });
    });
  }
  
  // Extract tags from RAWG tags
  if (rawgGame.tags) {
    rawgGame.tags.forEach(tag => {
      // Avoid duplicates
      if (!tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
        tags.push({ id: tag.id, name: tag.name });
      }
    });
  }
  
  return {
    id: rawgGame.id,
    title: rawgGame.name,
    developer: getDeveloperFromGame(rawgGame),
    publisher: getPublisherFromGame(rawgGame),
    release_date: rawgGame.released,
    description: rawgGame.description_raw || rawgGame.description || '',
    cover_image_url: rawgGame.background_image,
    avg_rating: rawgGame.rating,
    rating_count: rawgGame.ratings_count,
    platforms: rawgGame.platforms ? rawgGame.platforms.map(p => p.platform.name) : [],
    tags: tags,
    metacritic: rawgGame.metacritic,
    website: rawgGame.website,
    screenshots: screenshots.map(screenshot => screenshot.image),
    esrb_rating: rawgGame.esrb_rating ? rawgGame.esrb_rating.name : null
  };
}

/**
 * Extract developer from RAWG game data
 * @param {Object} rawgGame - Game data from RAWG API
 * @returns {string} Developer name or 'Unknown Developer'
 */
function getDeveloperFromGame(rawgGame) {
  if (rawgGame.developers && rawgGame.developers.length > 0) {
    return rawgGame.developers[0].name;
  }
  return 'Unknown Developer';
}

/**
 * Extract publisher from RAWG game data
 * @param {Object} rawgGame - Game data from RAWG API
 * @returns {string} Publisher name or 'Unknown Publisher'
 */
function getPublisherFromGame(rawgGame) {
  if (rawgGame.publishers && rawgGame.publishers.length > 0) {
    return rawgGame.publishers[0].name;
  }
  return 'Unknown Publisher';
}

// Sample games data
function getSampleGames() {
    return [
        {
            id: 3498,
            name: "Grand Theft Auto V",
            background_image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
            rating: 4.48,
            ratings_count: 6040,
            released: "2013-09-17",
            developers: [{ name: "Rockstar North" }],
            publishers: [{ name: "Rockstar Games" }]
        },
        {
            id: 3328,
            name: "The Witcher 3: Wild Hunt",
            background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
            rating: 4.67,
            ratings_count: 5398,
            released: "2015-05-18",
            developers: [{ name: "CD Projekt RED" }],
            publishers: [{ name: "CD Projekt RED" }]
        },
        {
            id: 4200,
            name: "Portal 2",
            background_image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
            rating: 4.62,
            ratings_count: 4434,
            released: "2011-04-18",
            developers: [{ name: "Valve" }],
            publishers: [{ name: "Valve" }]
        },
        {
            id: 5286,
            name: "Tomb Raider (2013)",
            background_image: "https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg",
            rating: 4.06,
            ratings_count: 3734,
            released: "2013-03-05",
            developers: [{ name: "Crystal Dynamics" }],
            publishers: [{ name: "Square Enix" }]
        },
        {
            id: 4291,
            name: "Counter-Strike: Global Offensive",
            background_image: "https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg",
            rating: 3.56,
            ratings_count: 3209,
            released: "2012-08-21",
            developers: [{ name: "Valve" }],
            publishers: [{ name: "Valve" }]
        },
        {
            id: 5679,
            name: "The Elder Scrolls V: Skyrim",
            background_image: "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
            rating: 4.42,
            ratings_count: 4279,
            released: "2011-11-11",
            developers: [{ name: "Bethesda Game Studios" }],
            publishers: [{ name: "Bethesda Softworks" }]
        },
        {
            id: 12020,
            name: "Left 4 Dead 2",
            background_image: "https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg",
            rating: 4.09,
            ratings_count: 2388,
            released: "2009-11-17",
            developers: [{ name: "Valve" }],
            publishers: [{ name: "Valve" }]
        },
        {
            id: 13536,
            name: "Portal",
            background_image: "https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg",
            rating: 4.51,
            ratings_count: 3920,
            released: "2007-10-09",
            developers: [{ name: "Valve" }],
            publishers: [{ name: "Valve" }]
        },
        {
            id: 4062,
            name: "BioShock Infinite",
            background_image: "https://media.rawg.io/media/games/fc1/fc1307a2774506b5bd65d7e8424664a7.jpg",
            rating: 4.38,
            ratings_count: 3314,
            released: "2013-03-26",
            developers: [{ name: "Irrational Games" }],
            publishers: [{ name: "2K Games" }]
        },
        {
            id: 802,
            name: "Borderlands 2",
            background_image: "https://media.rawg.io/media/games/49c/49c3dfa4ce2f6f140cc4825868e858cb.jpg",
            rating: 4.03,
            ratings_count: 2441,
            released: "2012-09-18",
            developers: [{ name: "Gearbox Software" }],
            publishers: [{ name: "2K Games" }]
        },
        {
            id: 3070,
            name: "Fallout 4",
            background_image: "https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg",
            rating: 3.8,
            ratings_count: 3081,
            released: "2015-11-09",
            developers: [{ name: "Bethesda Game Studios" }],
            publishers: [{ name: "Bethesda Softworks" }]
        },
        {
            id: 3439,
            name: "Life is Strange",
            background_image: "https://media.rawg.io/media/games/562/562553814dd54e001a541e4ee83a591c.jpg",
            rating: 4.11,
            ratings_count: 2424,
            released: "2015-01-29",
            developers: [{ name: "Dontnod Entertainment" }],
            publishers: [{ name: "Square Enix" }]
        },
        {
            id: 16944,
            name: "The Witcher 2: Assassins of Kings Enhanced Edition",
            background_image: "https://media.rawg.io/media/games/6cd/6cd699a29ba58f5e33212a0f8611195b.jpg",
            rating: 4.16,
            ratings_count: 1171,
            released: "2012-04-17",
            developers: [{ name: "CD Projekt RED" }],
            publishers: [{ name: "CD Projekt RED" }]
        },
        {
            id: 416,
            name: "Grand Theft Auto: San Andreas",
            background_image: "https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg",
            rating: 4.51,
            ratings_count: 2135,
            released: "2004-10-26",
            developers: [{ name: "Rockstar North" }],
            publishers: [{ name: "Rockstar Games" }]
        },
        {
            id: 4248,
            name: "Dishonored",
            background_image: "https://media.rawg.io/media/games/4e6/4e6e8e7f50c237d76f38f3c885dae3d2.jpg",
            rating: 4.38,
            ratings_count: 1952,
            released: "2012-10-09",
            developers: [{ name: "Arkane Studios" }],
            publishers: [{ name: "Bethesda Softworks" }]
        },
        {
            id: 19103,
            name: "Half-Life 2",
            background_image: "https://media.rawg.io/media/games/198/1988a337305e008b41d7f536ce9b73f6.jpg",
            rating: 4.49,
            ratings_count: 2125,
            released: "2004-11-16",
            developers: [{ name: "Valve" }],
            publishers: [{ name: "Valve" }]
        },
        {
            id: 5563,
            name: "Fallout: New Vegas",
            background_image: "https://media.rawg.io/media/games/995/9951d9d55323d08967640f7b9ab3e342.jpg",
            rating: 4.44,
            ratings_count: 2004,
            released: "2010-10-19",
            developers: [{ name: "Obsidian Entertainment" }],
            publishers: [{ name: "Bethesda Softworks" }]
        },
        {
            id: 4161,
            name: "Far Cry 3",
            background_image: "https://media.rawg.io/media/games/15c/15c95a4915f88a3e89c821526afe05fc.jpg",
            rating: 4.24,
            ratings_count: 1870,
            released: "2012-11-28",
            developers: [{ name: "Ubisoft Montreal" }],
            publishers: [{ name: "Ubisoft Entertainment" }]
        },
        {
            id: 10035,
            name: "Hitman",
            background_image: "https://media.rawg.io/media/games/16b/16b1b7b36e2042d1128d5a3e852b3b2f.jpg",
            rating: 4.07,
            ratings_count: 1149,
            released: "2016-03-11",
            developers: [{ name: "IO Interactive" }],
            publishers: [{ name: "Square Enix" }]
        },
        {
            id: 11859,
            name: "Team Fortress 2",
            background_image: "https://media.rawg.io/media/games/46d/46d98e6910fbc0706e2948a7cc9b10c5.jpg",
            rating: 3.67,
            ratings_count: 1633,
            released: "2007-10-10",
            developers: [{ name: "Valve" }],
            publishers: [{ name: "Valve" }]
        },
        {
            id: 4332,
            name: "Spec Ops: The Line",
            background_image: "https://media.rawg.io/media/games/b49/b4912b5dbfc7ed8927b65f05b8507f6c.jpg",
            rating: 4.09,
            ratings_count: 1165,
            released: "2012-06-26",
            developers: [{ name: "Yager Development" }],
            publishers: [{ name: "2K Games" }]
        },
        {
            id: 3272,
            name: "Rocket League",
            background_image: "https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg",
            rating: 3.95,
            ratings_count: 1279,
            released: "2015-07-07",
            developers: [{ name: "Psyonix" }],
            publishers: [{ name: "Psyonix" }]
        },
        {
            id: 4459,
            name: "Grand Theft Auto IV",
            background_image: "https://media.rawg.io/media/games/4a0/4a0a1316102366260e6f38fd2a9cfdce.jpg",
            rating: 4.26,
            ratings_count: 1390,
            released: "2008-04-29",
            developers: [{ name: "Rockstar North" }],
            publishers: [{ name: "Rockstar Games" }]
        }
    ];
}

/**
 * Gets sample game details for fallback
 * @param {number|string} gameId - ID of the game to get details for
 * @returns {Object|null} - Sample game details or null if not found
 */
function getSampleGameDetails(gameId) {
    const gameIdNum = parseInt(gameId);
    
    // Detailed game objects
    const detailedGames = {
        3498: {
            id: 3498,
            name: "Grand Theft Auto V",
            description_raw: "Grand Theft Auto V is an action-adventure game set in an open world environment. The game is played from either a third-person or first-person perspective and its world is navigated on foot or by vehicle. Players control the three lead protagonists throughout single-player and switch between them both during and outside missions. The story is centered on the heist sequences, and many missions involve shooting and driving gameplay. A \"wanted\" system governs the aggression of law enforcement response to players who commit crimes.",
            background_image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
            released: "2013-09-17",
            rating: 4.48,
            ratings_count: 6040,
            developers: [{ name: "Rockstar North" }],
            publishers: [{ name: "Rockstar Games" }],
            genres: [
                { name: "Action" },
                { name: "Adventure" }
            ],
            platforms: [
                { platform: { name: "PlayStation 5" } },
                { platform: { name: "PlayStation 4" } },
                { platform: { name: "PlayStation 3" } },
                { platform: { name: "Xbox Series S/X" } },
                { platform: { name: "Xbox One" } },
                { platform: { name: "Xbox 360" } },
                { platform: { name: "PC" } }
            ]
        },
        3328: {
            id: 3328,
            name: "The Witcher 3: Wild Hunt",
            description_raw: "The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. In The Witcher, you play as a professional monster hunter, Geralt of Rivia, tasked with finding a child of prophecy in a vast open world rich with merchant cities, dangerous mountain passes, and forgotten caverns to explore. The game takes place in a unique setting combining elements of Slavic mythology and classic fantasy literature, where monsters, magic, and the conflict between powerful political forces shape the land.",
            background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
            released: "2015-05-18",
            rating: 4.67,
            ratings_count: 5398,
            developers: [{ name: "CD Projekt RED" }],
            publishers: [{ name: "CD Projekt RED" }],
            genres: [
                { name: "Action" },
                { name: "Adventure" },
                { name: "RPG" }
            ],
            platforms: [
                { platform: { name: "PlayStation 5" } },
                { platform: { name: "PlayStation 4" } },
                { platform: { name: "Xbox Series S/X" } },
                { platform: { name: "Xbox One" } },
                { platform: { name: "Nintendo Switch" } },
                { platform: { name: "PC" } }
            ]
        },
        4200: {
            id: 4200,
            name: "Portal 2",
            description_raw: "Portal 2 is a first-person puzzle game developed by Valve Corporation and released on April 19, 2011, for Windows, macOS, Linux, PlayStation 3, and Xbox 360. The digital PC version is distributed online by Valve's Steam service, while all retail editions were distributed by Electronic Arts. Portal 2 continues the narrative of its predecessor Portal, retaining the first-person perspective, the physics-based gameplay, and the dark humor that made the original a hit.",
            background_image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
            released: "2011-04-18",
            rating: 4.62,
            ratings_count: 4434,
            developers: [{ name: "Valve" }],
            publishers: [{ name: "Valve" }],
            genres: [
                { name: "Shooter" },
                { name: "Puzzle" }
            ],
            platforms: [
                { platform: { name: "PlayStation 3" } },
                { platform: { name: "Xbox 360" } },
                { platform: { name: "PC" } },
                { platform: { name: "macOS" } },
                { platform: { name: "Linux" } }
            ]
        },
        5286: {
            id: 5286,
            name: "Tomb Raider (2013)",
            description_raw: "Tomb Raider explores the intense and gritty origin story of Lara Croft and her ascent from a young woman to a hardened survivor. Armed only with raw instincts and the ability to push beyond the limits of human endurance, Lara must fight to unravel the dark history of a forgotten island to escape its relentless hold. The game's innovative combat system allows players to create multiple strategies in action-packed gameplay.",
            background_image: "https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg",
            released: "2013-03-05",
            rating: 4.06,
            ratings_count: 3734,
            developers: [{ name: "Crystal Dynamics" }],
            publishers: [{ name: "Square Enix" }],
            genres: [
                { name: "Action" },
                { name: "Adventure" }
            ],
            platforms: [
                { platform: { name: "PlayStation 4" } },
                { platform: { name: "PlayStation 3" } },
                { platform: { name: "Xbox One" } },
                { platform: { name: "Xbox 360" } },
                { platform: { name: "PC" } },
                { platform: { name: "macOS" } }
            ]
        }
    };
    
    // Check if we have detailed info for this game
    if (detailedGames[gameIdNum]) {
        return detailedGames[gameIdNum];
    }
    
    // If not, look in the sample games list
    const sampleGame = getSampleGames().find(game => game.id === gameIdNum);
    
    if (sampleGame) {
        // Add required fields for detailed view
        return {
            ...sampleGame,
            description_raw: "No detailed description available for this game in offline mode.",
            genres: [{ name: "Action" }, { name: "Adventure" }],
            platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
        };
    }
    
    // Return null if game not found
    return null;
}

// Export all functions
export {
    fetchGames,
    fetchGameDetails,
    fetchGameScreenshots,
    searchGames,
    transformGameData,
    transformGameDetails
}; 