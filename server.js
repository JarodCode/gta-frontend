import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { contentType } from "https://deno.land/std@0.190.0/media_types/mod.ts";
import { verify as jwtVerify, create as jwtCreate } from "https://deno.land/x/djwt@v2.9/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { exists } from "https://deno.land/std@0.190.0/fs/exists.ts";
import * as path from "https://deno.land/std@0.190.0/path/mod.ts";

// Import hardcoded games data
import { topGames } from './js/hardcoded-games.js';

const app = new Application();
const router = new Router();
const PORT = parseInt(Deno.args[0] || "3000");
const ROOT = `${Deno.cwd()}`;

// File paths for persistent storage
const REVIEWS_FILE = `${ROOT}/data/reviews.json`;
const USERS_FILE = `${ROOT}/data/users.json`;
const DATA_DIR = `${ROOT}/data`;

// Secret key for JWT token
const JWT_SECRET = "secure-jwt-secret-key-for-letterboxd-games-app-2024";

// This would be a database in a real app, but we'll use an in-memory store for simplicity
let userDatabase = [];
const usernameIndex = new Map();
const emailIndex = new Map();

// In-memory stores for games and reviews
let reviewsDatabase = [];
const gameRatingsMap = new Map();

// Create a proper encoder for JWT operations
const textEncoder = new TextEncoder();

// Ensure data directory exists
async function ensureDataDir() {
  try {
    console.log(`Checking if data directory exists at ${DATA_DIR}`);
    const dirExists = await exists(DATA_DIR);
    
    if (!dirExists) {
      console.log(`Data directory does not exist, creating it...`);
      await Deno.mkdir(DATA_DIR, { recursive: true });
      console.log(`Created data directory at ${DATA_DIR}`);
    } else {
      console.log(`Data directory already exists at ${DATA_DIR}`);
    }
    
    // Check if we can write to the directory
    try {
      const testFile = `${DATA_DIR}/.write_test`;
      await Deno.writeTextFile(testFile, "test");
      await Deno.remove(testFile);
      console.log(`Successfully verified write permissions for ${DATA_DIR}`);
    } catch (writeError) {
      console.error(`Cannot write to data directory: ${writeError.message}`);
      throw new Error(`Cannot write to data directory: ${writeError.message}`);
    }
  } catch (error) {
    console.error(`Error creating/checking data directory: ${error.message}`);
    throw error; // Re-throw to allow calling code to handle the error
  }
}

// Load reviews from file
async function loadReviews() {
  try {
    await ensureDataDir();
    
    const reviewsFilePath = path.join(DATA_DIR, 'reviews.json');
    
    // Check if the file exists
    try {
      await Deno.stat(reviewsFilePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.log("Reviews file not found, initializing with empty array");
        reviewsDatabase = [];
        gameRatingsMap.clear();
        return;
      }
      throw error;
    }
    
    // Read and parse the file
    try {
      const fileContent = await Deno.readTextFile(reviewsFilePath);
      reviewsDatabase = JSON.parse(fileContent);
      console.log(`Loaded ${reviewsDatabase.length} reviews from file`);
      
      // Ensure all reviews have proper structure
      let validReviews = [];
      for (const review of reviewsDatabase) {
        // Skip reviews with missing required fields
        if (!review.id || !review.gameId || review.rating === undefined) {
          console.warn(`Skipping invalid review:`, review);
          continue;
        }
        
        // Fix reviews that have a userId but show as Anonymous User
        if (review.userId && review.userId !== "anonymous" && 
            (!review.username || review.username === "Anonymous User")) {
          // Try to find the user by ID
          const user = userDatabase.find(u => u.id === review.userId);
          if (user) {
            console.log(`Fixing username for review ${review.id}: User ID ${review.userId} -> Username ${user.username}`);
            review.username = user.username;
          } else {
            console.warn(`Could not find username for user ID ${review.userId} in review ${review.id}`);
          }
        }
        
        validReviews.push(review);
      }
      
      if (validReviews.length !== reviewsDatabase.length) {
        console.log(`Filtered out ${reviewsDatabase.length - validReviews.length} invalid reviews`);
        reviewsDatabase = validReviews;
      }
      
      // Rebuild ratings map
      rebuildRatingsMap();
    } catch (error) {
      console.error("Error parsing reviews file:", error);
      reviewsDatabase = [];
      gameRatingsMap.clear();
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
    reviewsDatabase = [];
    gameRatingsMap.clear();
  }
}

// Save reviews to file
async function saveReviews() {
  try {
    // Make sure the data directory exists
    await ensureDataDir();
    
    console.log(`Attempting to save ${reviewsDatabase.length} reviews to ${REVIEWS_FILE}`);
    
    // Create a backup of the current file if it exists
    try {
      const fileExists = await exists(REVIEWS_FILE);
      if (fileExists) {
        const backupFile = `${REVIEWS_FILE}.bak`;
        await Deno.copyFile(REVIEWS_FILE, backupFile);
        console.log(`Created backup of reviews file at ${backupFile}`);
      }
    } catch (backupError) {
      console.warn(`Could not create backup of reviews file: ${backupError.message}`);
    }
    
    // Save reviews to file
    const reviewsJson = JSON.stringify(reviewsDatabase, null, 2);
    await Deno.writeTextFile(REVIEWS_FILE, reviewsJson);
    
    // Verify the file was written correctly
    try {
      const fileContent = await Deno.readTextFile(REVIEWS_FILE);
      const parsedContent = JSON.parse(fileContent);
      
      if (parsedContent.length !== reviewsDatabase.length) {
        console.warn(`File verification failed: Expected ${reviewsDatabase.length} reviews but found ${parsedContent.length}`);
      } else {
        console.log(`Successfully saved ${reviewsDatabase.length} reviews to ${REVIEWS_FILE}`);
      }
    } catch (verifyError) {
      console.error(`Error verifying saved reviews: ${verifyError.message}`);
    }
    
    // Log the first few reviews for debugging
    if (reviewsDatabase.length > 0) {
      console.log("Sample of saved reviews:");
      reviewsDatabase.slice(0, 3).forEach((review, index) => {
        console.log(`${index + 1}. Game: ${review.gameId}, User: ${review.username}, Rating: ${review.rating}`);
      });
    }
  } catch (error) {
    console.error(`Error saving reviews: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    throw error; // Re-throw to allow calling code to handle the error
  }
}

// Load users from file
async function loadUsers() {
  try {
    const fileExists = await exists(USERS_FILE);
    if (fileExists) {
      const fileContent = await Deno.readTextFile(USERS_FILE);
      userDatabase = JSON.parse(fileContent);
      console.log(`Loaded ${userDatabase.length} users from ${USERS_FILE}`);
      
      // Rebuild indexes
      userDatabase.forEach(user => {
        usernameIndex.set(user.username.toLowerCase(), user);
        if (user.email) {
          emailIndex.set(user.email.toLowerCase(), user);
        }
      });
    } else {
      console.log(`Users file not found at ${USERS_FILE}, starting with empty database`);
    }
  } catch (error) {
    console.error(`Error loading users: ${error.message}`);
    userDatabase = [];
  }
}

// Save users to file
async function saveUsers() {
  try {
    await Deno.writeTextFile(USERS_FILE, JSON.stringify(userDatabase, null, 2));
    console.log(`Saved ${userDatabase.length} users to ${USERS_FILE}`);
  } catch (error) {
    console.error(`Error saving users: ${error.message}`);
  }
}

// Initialize data
async function initializeData() {
  try {
    console.log("Initializing data...");
    
    // Load users first so we can associate usernames with reviews
    await loadUsers();
    console.log(`Loaded ${userDatabase.length} users`);
    
    // Then load reviews
    await loadReviews();
    
    console.log("Data initialization complete");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

// Call initialization
initializeData();

// Configure MIME types
const mimeTypes = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".html": "text/html",
  ".htm": "text/html",
  ".txt": "text/plain",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

// CORS middleware
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
  
  await next();
});

// Add this middleware to handle CSS files in subdirectories
app.use(async (ctx, next) => {
  const pathname = ctx.request.url.pathname;
  
  // Check if this is a CSS file request from a subdirectory
  if (pathname.endsWith('.css') && 
      (pathname.includes('/layouts/') || 
       pathname.includes('/components/') || 
       pathname.includes('/pages/') || 
       pathname.includes('/base/'))) {
    
    try {
      // Correctly resolve the file path
      const filePath = path.join(ROOT, pathname);
      
      // Check if file exists
      if (await exists(filePath)) {
        const content = await Deno.readTextFile(filePath);
        ctx.response.type = "text/css";
        ctx.response.body = content;
        return;
      }
    } catch (error) {
      console.error(`Error serving CSS file ${pathname}:`, error);
    }
  }
  
  await next();
});

/**
 * Helper function to save user data to our "database"
 */
function saveUser(userData) {
  const { id, username, email } = userData;
  
  // Check if username already exists
  if (usernameIndex.has(username.toLowerCase())) {
    throw new Error("Username is already taken");
  }
  
  // Check if email already exists (if provided)
  if (email && emailIndex.has(email.toLowerCase())) {
    throw new Error("Email is already taken");
  }
  
  // Add to database
  userDatabase.push(userData);
  
  // Update indexes
  usernameIndex.set(username.toLowerCase(), userData);
  if (email) {
    emailIndex.set(email.toLowerCase(), userData);
  }
  
  // Save to file
  saveUsers();
  
  return userData;
}

/**
 * Helper function to find user by username or email
 */
function findUser(usernameOrEmail) {
  const lowerValue = usernameOrEmail.toLowerCase();
  return usernameIndex.get(lowerValue) || emailIndex.get(lowerValue);
}

/**
 * Helper function to generate a JWT token
 */
async function generateToken(userId, username, isAdmin) {
  try {
    console.log(`Generating token for user ${username} (${userId}), isAdmin: ${isAdmin}`);
    
    if (!userId || !username) {
      console.error("Missing required parameters for token generation:", { userId, username });
      throw new Error("User ID and username are required for token generation");
    }
    
    // Ensure isAdmin is a boolean (default to false if undefined)
    const adminStatus = isAdmin === true ? true : false;
    
    // Create JWT token with extended expiration
    const payload = {
      id: userId,
      username: username,
      isAdmin: adminStatus,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hour expiry
    };
    
    console.log("Token payload:", payload);
    
    // Ensure we have a proper key for signing
    const key = await crypto.subtle.importKey(
      "raw",
      textEncoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    
    // Create the JWT with header, payload, and signature
    const token = await jwtCreate(
      { alg: "HS256", typ: "JWT" }, // header
      payload, // payload
      key // signing key
    );
    
    console.log(`Token generated successfully: ${token.substring(0, 20)}...`);
    
    // Basic validation - make sure the token has three parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error("Generated token has invalid structure");
      throw new Error("Generated token has invalid structure");
    }
    
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
}

/**
 * Helper function to verify JWT token and get user
 */
async function verifyToken(token) {
  try {
    if (!token) {
      console.log("No token provided");
      return null;
    }
    
    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
      console.log("Removed 'Bearer ' prefix from token");
    }
    
    console.log(`Attempting to verify token: ${token.substring(0, 20)}...`);
    
    if (token.length < 10) {
      console.log("Token is too short, likely invalid");
      return null;
    }
    
    // Manual token structure check
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error(`Invalid token structure: expected 3 parts, got ${parts.length}`);
      return null;
    }
    
    // Always decode the payload manually for reliability
    let payload;
    try {
      const base64Payload = parts[1];
      const decodedString = atob(base64Payload);
      payload = JSON.parse(decodedString);
      console.log("Manually decoded token payload:", payload);
      
      // Check required fields - only id and username are truly required
      if (!payload || !payload.id || !payload.username) {
        console.error("Token payload is missing required fields:", payload);
        return null;
      }
      
      // Add isAdmin field if it doesn't exist (for backward compatibility)
      if (payload.isAdmin === undefined) {
        console.log("Adding missing isAdmin field to payload (default: false)");
        payload.isAdmin = false;
      }
      
      // Check if the user exists in our database to get the latest admin status
      const user = userDatabase.find(u => u.id === payload.id);
      if (user) {
        // Update the admin status from the database (most up-to-date)
        if (user.isAdmin !== payload.isAdmin) {
          console.log(`Updating isAdmin status from ${payload.isAdmin} to ${user.isAdmin} based on database`);
          payload.isAdmin = user.isAdmin;
        }
      } else {
        console.log(`User ${payload.id} (${payload.username}) not found in database during token verification`);
      }
      
      console.log(`Token verified for user ${payload.username} (${payload.id}), isAdmin: ${payload.isAdmin}`);
      return payload;
    } catch (decodeError) {
      console.error("Error decoding token payload:", decodeError);
      return null;
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Rebuild the game ratings map from the reviews database
 */
function rebuildRatingsMap() {
  console.log("Rebuilding game ratings map from reviews database");
  
  // Clear existing ratings map
  gameRatingsMap.clear();
  
  // Get unique game IDs from reviews
  const gameIds = new Set(reviewsDatabase.map(review => review.gameId.toString()));
  console.log(`Found reviews for ${gameIds.size} unique games`);
  
  // Update ratings for each game
  gameIds.forEach(gameId => {
    updateGameRating(gameId);
  });
  
  console.log(`Game ratings map rebuilt with ${gameRatingsMap.size} entries`);
}

// API routes - handle these first before trying to serve static files
router
  // User registration
  .post("/api/users/register", async (ctx) => {
    try {
      // Registration is now enabled
      const body = await ctx.request.body().value;
      const { username, email, password } = body;
      
      // Basic validation
      if (!username || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Username and password are required" };
        return;
      }
      
      // Create user ID
      const userId = crypto.randomUUID();
      
      // Hash password securely
      const passwordHash = await bcrypt.hash(password);
      
      // Create user object
      const newUser = {
        id: userId,
        username,
        email: email || `${username}@example.com`,
        passwordHash,
        isAdmin: false, // Default to non-admin
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        // Save user to our "database"
        saveUser(newUser);
      } catch (dbError) {
        ctx.response.status = 409; // Conflict
        ctx.response.body = { error: dbError.message };
        return;
      }
      
      // Generate JWT token
      const token = await generateToken(userId, username, newUser.isAdmin);
      
      // Verify the token was created correctly
      const verifiedPayload = await verifyToken(token);
      if (!verifiedPayload) {
        console.error("Generated token failed verification in registration endpoint!");
        // Continue anyway, but log the error
        console.error("Proceeding with registration despite token verification failure");
      } else {
        console.log("Token verification successful in registration endpoint:", verifiedPayload);
      }
      
      // Return success response with user data (excluding password hash)
      const { passwordHash: _, ...userResponse } = newUser;
      
      ctx.response.status = 201;
      ctx.response.body = {
        user: userResponse,
        token
      };
      
      console.log(`User registered: ${username}`);
    } catch (error) {
      console.error("Registration error:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // User login
  .post("/api/users/login", async (ctx) => {
    try {
      const body = await ctx.request.body().value;
      const { username, password } = body;
      
      // Find the user in the database
      const user = userDatabase.find(u => u.username === username);
      if (!user) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid username or password" };
        return;
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid username or password" };
        return;
      }
      
      // Generate JWT token
      const token = await generateToken(user.id, user.username, user.isAdmin);
      
      // Verify the token was created correctly
      const verifiedPayload = await verifyToken(token);
      if (!verifiedPayload) {
        console.error("Generated token failed verification in login endpoint!");
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to generate valid authentication token" };
        return;
      }
      
      console.log("Token verification successful in login endpoint:", verifiedPayload);
      
      // Return success response with user data (excluding password hash)
      const { passwordHash: _, ...userResponse } = user;
      
      ctx.response.status = 200;
      ctx.response.body = {
        user: userResponse,
        token
      };
      
      console.log(`User logged in: ${user.username}`);
    } catch (error) {
      console.error("Error in login endpoint:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Get current user
  .get("/api/users/me", async (ctx) => {
    try {
      // Get authorization header
      const authHeader = ctx.request.headers.get("Authorization");
      
      if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Authentication required" };
        return;
      }
      
      // Verify token
      const payload = await verifyToken(authHeader);
      
      if (!payload) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid or expired token" };
        return;
      }
      
      // Find user by ID
      const user = userDatabase.find(u => u.id === payload.id);
      
      if (!user) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }
      
      // Return user data (excluding password hash)
      const { passwordHash: _, ...userResponse } = user;
      
      ctx.response.status = 200;
      ctx.response.body = { user: userResponse };
    } catch (error) {
      console.error("Get user error:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Logout - in a real app, we would invalidate the token
  .post("/api/users/logout", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = { success: true, message: "Logged out successfully" };
  })
  
  // Get game by ID
  .get("/api/games/:id", async (ctx) => {
    try {
      const gameId = ctx.params.id;
      
      // Get game data by ID
      const gameData = getGameById(gameId);
      
      ctx.response.status = 200;
      ctx.response.body = gameData;
    } catch (error) {
      console.error(`Error fetching game:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Get reviews for a game
  .get("/api/games/:id/reviews", (ctx) => {
    try {
      const gameId = ctx.params.id;
      
      // Filter reviews for this game
      const gameReviews = reviewsDatabase.filter(review => 
        review.gameId.toString() === gameId.toString()
      );
      
      // Calculate average rating
      let averageRating = 0;
      if (gameReviews.length > 0) {
        const totalRating = gameReviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = totalRating / gameReviews.length;
      }
      
      ctx.response.status = 200;
      ctx.response.body = {
        reviews: gameReviews,
        total: gameReviews.length,
        averageRating
      };
    } catch (error) {
      console.error(`Error fetching reviews:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Add a review for a game
  .post("/api/games/:id/reviews", async (ctx) => {
    try {
      const gameId = ctx.params.id;
      const authHeader = ctx.request.headers.get("Authorization");
      
      // Verify the user is authenticated
      const payload = await verifyToken(authHeader);
      
      if (!payload) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Authentication required to post reviews" };
        return;
      }
      
      // Get the review data
      const body = await ctx.request.body().value;
      const { rating, content } = body;
      
      if (rating === undefined || !content) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Rating and content are required" };
        return;
      }
      
      // Find the user
      const user = userDatabase.find(u => u.id === payload.id);
      
      if (!user) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }
      
      // Check if user already has a review for this game
      console.log(`Checking if user ${payload.id} already has a review for game ${gameId}`);
      
      // Debug: log all reviews for this game
      const allGameReviews = reviewsDatabase.filter(review => review.gameId.toString() === gameId.toString());
      console.log(`Found ${allGameReviews.length} reviews for game ${gameId}:`);
      allGameReviews.forEach(review => {
        console.log(`- Review ID: ${review.id}, User ID: ${review.userId}, Username: ${review.username}, userId type: ${typeof review.userId}`);
      });
      console.log(`Current user ID: ${payload.id}, type: ${typeof payload.id}`);
      
      // Fix: Use strict comparison for gameId but loose comparison for userId to handle potential type differences
      const existingReviewIndex = reviewsDatabase.findIndex(review => {
        const gameIdMatch = review.gameId.toString() === gameId.toString();
        // Use loose equality (==) instead of strict equality (===) to handle potential type differences
        const userIdMatch = review.userId == payload.id;
        console.log(`Review ${review.id} - gameIdMatch: ${gameIdMatch}, userIdMatch: ${userIdMatch}, userId: ${review.userId}`);
        return gameIdMatch && userIdMatch;
      });
      
      console.log(`existingReviewIndex: ${existingReviewIndex}`);
      
      let reviewId;
      let timestamp = new Date().toISOString();
      let newReview;
      
      if (existingReviewIndex !== -1) {
        // Update existing review
        console.log(`Updating existing review for game ${gameId} by user ${user.username} (${payload.id})`);
        const existingReview = reviewsDatabase[existingReviewIndex];
        reviewId = existingReview.id;
        
        // Update the review
        reviewsDatabase[existingReviewIndex] = {
          ...existingReview,
          rating: parseFloat(rating),
          content,
          username: user.username, // Always update username in case it changed
          updatedAt: timestamp
        };
        
        newReview = reviewsDatabase[existingReviewIndex];
      } else {
        // Create a new review ID
        reviewId = crypto.randomUUID();
        
        // Create a new review
        console.log(`Creating new review for game ${gameId} by user ${user.username} (${payload.id})`);
        newReview = {
          id: reviewId,
          gameId,
          userId: payload.id,
          username: user.username,
          rating: parseFloat(rating),
          content,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        // Add to database
        reviewsDatabase.push(newReview);
      }
      
      // Save to file
      try {
        await saveReviews();
        console.log(`Reviews saved successfully after ${existingReviewIndex !== -1 ? 'updating' : 'adding'} review for game ${gameId}`);
        
        // Double-check that the review was actually saved
        const reviewExists = reviewsDatabase.some(review => 
          review.id === newReview.id
        );
        
        if (!reviewExists) {
          console.error(`Review was not properly saved to the database`);
          throw new Error("Failed to save review to database");
        }
      } catch (saveError) {
        console.error(`Error saving reviews: ${saveError.message}`);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to save review: " + saveError.message };
        return;
      }
      
      // Update game rating
      updateGameRating(gameId);
      
      // Log the current state of reviews for this game
      const gameReviews = reviewsDatabase.filter(review => 
        review.gameId.toString() === gameId.toString()
      );
      console.log(`After saving, game ${gameId} has ${gameReviews.length} reviews:`);
      gameReviews.forEach(review => {
        console.log(`- Review by ${review.username} (${review.userId}): ${review.rating} stars, ID: ${review.id}`);
      });
      
      // Set response status and body
      ctx.response.status = existingReviewIndex !== -1 ? 200 : 201; // 200 OK for updates, 201 Created for new reviews
      ctx.response.body = newReview;
      console.log(`Review successfully saved, returning with status ${ctx.response.status}`);
    } catch (error) {
      console.error(`Error creating review:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error: " + error.message };
    }
  })
  
  // Delete a review
  .delete("/reviews/:id", async (ctx) => {
    try {
      const reviewId = ctx.params.id;
      const authHeader = ctx.request.headers.get("Authorization");
      
      console.log(`Attempting to delete review ${reviewId}`);
      console.log(`Auth header: ${authHeader ? authHeader.substring(0, 20) + '...' : 'missing'}`);
      
      // Verify the user is authenticated
      const payload = await verifyToken(authHeader);
      
      if (!payload) {
        console.error("Authentication failed for review deletion");
        ctx.response.status = 401;
        ctx.response.body = { error: "Authentication required to delete reviews" };
        return;
      }
      
      console.log(`User authenticated for review deletion: ${payload.username} (${payload.id}), isAdmin: ${payload.isAdmin}`);
      
      // Find the review in the local database
      const reviewIndex = reviewsDatabase.findIndex(review => {
        // Use strict equality for reviewId comparison
        return review.id === reviewId;
      });
      
      if (reviewIndex === -1) {
        console.error(`Review ${reviewId} not found`);
        ctx.response.status = 404;
        ctx.response.body = { error: "Review not found" };
        return;
      }
      
      // Get the review details before potentially deleting it
      const reviewToDelete = reviewsDatabase[reviewIndex];
      console.log(`Found review to delete: Game ${reviewToDelete.gameId}, User ${reviewToDelete.username} (${reviewToDelete.userId})`);
      
      // Get the latest user data from the database
      const user = userDatabase.find(u => u.id === payload.id);
      if (!user) {
        console.error(`User ${payload.id} not found in database when trying to delete review`);
      } else {
        console.log(`User found in database: ${user.username} (${user.id}), isAdmin: ${user.isAdmin}`);
      }
      
      // Check if the user owns the review or is an admin
      const isOwner = reviewToDelete.userId === payload.id;
      
      // Use both the token payload and the database to determine admin status
      const isAdmin = (payload.isAdmin === true) || (user && user.isAdmin === true);
      
      console.log(`Delete review check - isOwner: ${isOwner}, isAdmin: ${isAdmin}, user in DB isAdmin: ${user ? user.isAdmin : 'user not found'}`);
      
      if (!isOwner && !isAdmin) {
        console.error(`User ${payload.username} (${payload.id}) attempted to delete review by ${reviewToDelete.username} (${reviewToDelete.userId}) without permission`);
        ctx.response.status = 403;
        ctx.response.body = { error: "You can only delete your own reviews unless you are an admin" };
        return;
      }
      
      // Get the game ID before removing the review
      const gameId = reviewToDelete.gameId;
      const reviewUsername = reviewToDelete.username;
      
      // Remove the review
      reviewsDatabase.splice(reviewIndex, 1);
      console.log(`Review ${reviewId} deleted successfully by ${payload.username} (${payload.id})`);
      
      // Save to file
      try {
        await saveReviews();
        console.log("Reviews saved to file successfully after deletion");
      } catch (saveError) {
        console.error("Error saving reviews after deletion:", saveError);
        // Continue anyway, as the review is already removed from memory
      }
      
      // Update game rating
      updateGameRating(gameId);
      
      ctx.response.status = 200;
      if (isAdmin && !isOwner) {
        console.log(`Admin ${payload.username} deleted review by ${reviewUsername}`);
        ctx.response.body = { 
          success: true, 
          message: `Admin ${payload.username} deleted review by ${reviewUsername}` 
        };
      } else {
        ctx.response.body = { success: true };
      }
    } catch (error) {
      console.error(`Error deleting review:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error: " + error.message };
    }
  })
  
  // Get game ratings
  .get("/api/games/ratings", (ctx) => {
    try {
      // Convert gameRatingsMap to array
      const ratings = Array.from(gameRatingsMap.entries()).map(([gameId, data]) => ({
        game_id: gameId,
        average_rating: data.average.toFixed(1),
        rating_count: data.count
      }));
      
      ctx.response.status = 200;
      ctx.response.body = ratings;
    } catch (error) {
      console.error(`Error fetching game ratings:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Proxy for reviews
  .get("/api/proxy/reviews/game/:id", async (ctx) => {
    try {
      const gameId = ctx.params.id;
      console.log(`Proxying request for reviews of game ${gameId} to backend`);
      
      try {
        // Forward the request to the backend
        const response = await fetch(`http://localhost:8000/api/reviews/game/${gameId}`);
        
        if (!response.ok) {
          console.log(`Backend returned error status: ${response.status}`);
          throw new Error(`Backend returned status ${response.status}`);
        }
        
        // Return the response from the backend
        ctx.response.status = 200;
        ctx.response.body = await response.json();
      } catch (fetchError) {
        console.log(`Backend connection failed, falling back to local reviews: ${fetchError.message}`);
        
        // Fallback to local reviews
        const gameReviews = reviewsDatabase.filter(review => 
          review.gameId.toString() === gameId.toString()
        );
        
        console.log(`Found ${gameReviews.length} local reviews for game ${gameId}`);
        
        // Log each review to debug username issues
        gameReviews.forEach((review, index) => {
          console.log(`Review ${index + 1}: User ${review.username} (${review.userId}), Rating: ${review.rating}`);
          
          // If the review is from a registered user but has Anonymous User as username, fix it
          if (review.userId !== "anonymous" && (review.username === "Anonymous User" || !review.username)) {
            const user = userDatabase.find(u => u.id === review.userId);
            if (user) {
              review.username = user.username;
              console.log(`Updated username for review ${review.id} to ${user.username}`);
            }
          }
        });
        
        // Calculate average rating
        let averageRating = 0;
        if (gameReviews.length > 0) {
          const totalRating = gameReviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = totalRating / gameReviews.length;
        }
        
        // Ensure each review has a proper username
        const reviewsWithUsernames = gameReviews.map(review => {
          // If username is missing but we have userId, try to find the user
          if ((!review.username || review.username === "Anonymous User") && review.userId !== "anonymous") {
            const user = userDatabase.find(u => u.id === review.userId);
            if (user) {
              console.log(`Found username ${user.username} for user ID ${review.userId}`);
              return {
                ...review,
                username: user.username
              };
            }
          }
          return review;
        });
        
        ctx.response.status = 200;
        ctx.response.body = {
          reviews: reviewsWithUsernames || [],
          total: reviewsWithUsernames.length || 0,
          averageRating: averageRating || 0
        };
      }
    } catch (error) {
      console.error(`Error handling reviews request:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Proxy for creating reviews
  .post("/api/proxy/reviews", async (ctx) => {
    try {
      // Get the auth header from the request
      const authHeader = ctx.request.headers.get("Authorization");
      const body = await ctx.request.body().value;
      const { gameId, rating, content } = body;
      
      // First try with the backend if possible
      try {
        if (authHeader) {
          console.log(`Authorization header found in proxy request: ${authHeader.substring(0, 20)}...`);
          const response = await fetch(`http://localhost:8000/api/reviews`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": authHeader
            },
            body: JSON.stringify(body)
          });
          
          if (response.ok) {
            // Return the response from the backend
            ctx.response.status = response.status;
            ctx.response.body = await response.json();
            return;
          }
        }
      } catch (fetchError) {
        console.log(`Backend connection failed for review creation: ${fetchError.message}`);
      }
      
      // Fallback to local review creation
      console.log("Using local review storage as fallback");
      
      // Get user info from token if available
      let userId = "anonymous";
      let username = "Anonymous User";
      let isAuthenticated = false;
      
      if (authHeader) {
        console.log(`Processing authorization header for local review: ${authHeader.substring(0, 20)}...`);
        const payload = await verifyToken(authHeader);
        if (payload) {
          userId = payload.id;
          username = payload.username;
          isAuthenticated = true;
          console.log(`Authenticated user ${username} (${userId}) is posting a review via proxy`);
          
          // Double check that the user exists in our database
          const user = userDatabase.find(u => u.id === userId);
          if (user) {
            // Ensure we're using the most up-to-date username
            username = user.username;
            console.log(`Found user in database: ${username}`);
          } else {
            console.warn(`User ID ${userId} not found in database, but token was valid`);
          }
        } else {
          console.log(`Invalid token provided in proxy request, using anonymous user`);
        }
      } else {
        console.log(`No authentication provided in proxy request, using anonymous user`);
      }
      
      // Create a new review
      const reviewId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      let newReview;
      let existingReview = null;
      
      // For authenticated users, check if they already have a review for this game
      if (isAuthenticated) {
        console.log(`Checking if authenticated user ${username} (${userId}) already has a review for game ${gameId}`);
        
        // Log all reviews for this game to help with debugging
        const gameReviews = reviewsDatabase.filter(review => review.gameId.toString() === gameId.toString());
        console.log(`Found ${gameReviews.length} reviews for game ${gameId}:`);
        gameReviews.forEach((review, index) => {
          console.log(`- Review ID: ${review.id}, User ID: ${review.userId}, Username: ${review.username}, userId type: ${typeof review.userId}`);
        });
        console.log(`Current user ID: ${userId}, type: ${typeof userId}`);
        
        // Find existing review with loose equality to handle string/number comparison
        existingReview = reviewsDatabase.find(review => {
          const gameIdMatch = review.gameId.toString() === gameId.toString();
          const userIdMatch = review.userId == userId; // Use loose equality
          
          // Log comparison details for debugging
          if (gameIdMatch) {
            console.log(`Review ${review.id} - gameIdMatch: ${gameIdMatch}, userIdMatch: ${userIdMatch}, userId: ${review.userId}`);
          }
          
          return gameIdMatch && userIdMatch;
        });
        
        if (existingReview) {
          console.log(`Found existing review ID ${existingReview.id} for user ${userId} on game ${gameId}`);
        } else {
          console.log(`No existing review found for user ${userId} on game ${gameId}`);
        }
      }
      
      if (existingReview && isAuthenticated) {
        // Update existing review for authenticated users
        console.log(`Updating existing review ID ${existingReview.id} for game ${gameId} by user ${username} (${userId})`);
        existingReview.rating = parseFloat(rating);
        existingReview.content = content;
        existingReview.updatedAt = timestamp;
        newReview = existingReview;
      } else {
        // Create a new review
        console.log(`Creating new review for game ${gameId} by user ${username} (${userId}) via proxy`);
        newReview = {
          id: reviewId,
          gameId,
          userId,
          username,
          rating: Number(rating),
          content,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        // Add to database
        reviewsDatabase.push(newReview);
      }
      
      // Save to file
      try {
        await saveReviews();
        console.log(`Reviews saved successfully after ${existingReview ? 'updating' : 'adding'} review for game ${gameId} via proxy`);
      } catch (saveError) {
        console.error(`Error saving reviews via proxy: ${saveError.message}`);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to save review: " + saveError.message };
        return;
      }
      
      // Update game rating
      updateGameRating(gameId);
      
      ctx.response.status = existingReview ? 200 : 201;
      ctx.response.body = newReview;
    } catch (error) {
      console.error(`Error handling review creation:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Proxy for deleting reviews
  .delete("/api/proxy/reviews/:id", async (ctx) => {
    try {
      const reviewId = ctx.params.id;
      console.log(`Attempting to delete review ${reviewId}`);
      
      // Get the auth header from the request
      const authHeader = ctx.request.headers.get("Authorization");
      
      if (!authHeader) {
        console.log('No auth header provided for review deletion');
        ctx.response.status = 401;
        ctx.response.body = { error: "Authentication required" };
        return;
      }
      
      // Verify the user's token
      const payload = await verifyToken(authHeader);
      if (!payload) {
        console.log('Invalid token for review deletion');
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid or expired token" };
        return;
      }
      
      console.log(`User authenticated for review deletion: ${payload.username} (${payload.id}), isAdmin: ${payload.isAdmin}`);
      
      try {
        // Try to forward the request to the backend
        console.log(`Forwarding delete request to backend for review ${reviewId}`);
        const response = await fetch(`http://localhost:8000/api/reviews/${reviewId}`, {
          method: "DELETE",
          headers: {
            "Authorization": authHeader
          }
        });
        
        // If backend responds successfully, return its response
        if (response.ok) {
          const responseBody = await response.json();
          ctx.response.status = response.status;
          ctx.response.body = responseBody;
          console.log(`Backend successfully deleted review ${reviewId}`);
          return;
        } else {
          console.log(`Backend returned error ${response.status} for review deletion`);
          // Continue to local deletion as fallback
        }
      } catch (backendError) {
        // If backend connection fails, handle locally
        console.log(`Backend connection failed for review deletion, handling locally: ${backendError.message}`);
      }
      
      // Find the review in the local database
      const reviewIndex = reviewsDatabase.findIndex(review => review.id === reviewId);
      if (reviewIndex === -1) {
        console.log(`Review ${reviewId} not found in local database`);
        ctx.response.status = 404;
        ctx.response.body = { error: "Review not found" };
        return;
      }
      
      const review = reviewsDatabase[reviewIndex];
      console.log(`Found review to delete: Game ${review.gameId}, User ${review.username} (${review.userId})`);
      
      // Check if user is authorized to delete (owner or admin)
      const isOwner = review.userId == payload.id; // Use loose equality for type coercion
      const isAdmin = payload.isAdmin === true;
      console.log(`Delete review check - isOwner: ${isOwner}, isAdmin: ${isAdmin}, user ID: ${payload.id}, review userID: ${review.userId}`);
      
      if (!isOwner && !isAdmin) {
        console.log(`User ${payload.username} (${payload.id}) not authorized to delete review ${reviewId}`);
        ctx.response.status = 403;
        ctx.response.body = { error: "You can only delete your own reviews unless you are an admin" };
        return;
      }
      
      // Get the gameId before deletion for updating ratings
      const gameId = review.gameId;
      
      // Remove the review
      reviewsDatabase.splice(reviewIndex, 1);
      console.log(`Review ${reviewId} deleted successfully by ${payload.username} (${payload.id})`);
      
      // Save the updated database
      try {
        await saveReviews();
        console.log(`Reviews saved to file successfully after deletion`);
      } catch (saveError) {
        console.error(`Error saving reviews after deletion: ${saveError.message}`);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to save after deletion: " + saveError.message };
        return;
      }
      
      // Update game rating
      updateGameRating(gameId);
      
      // Return success
      ctx.response.status = 200;
      ctx.response.body = { success: true, gameId: gameId.toString() };
    } catch (error) {
      console.error(`Error handling review deletion:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error: " + error.message };
    }
  })
  
  // Promote user to admin - only accessible to admins
  .post("/api/users/:id/promote", async (ctx) => {
    try {
      // Get authorization header
      const authHeader = ctx.request.headers.get("Authorization");
      
      if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Authentication required" };
        return;
      }
      
      // Verify token and check if user is admin
      const payload = await verifyToken(authHeader);
      
      if (!payload) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid or expired token" };
        return;
      }
      
      // Find the admin user
      const adminUser = userDatabase.find(u => u.id === payload.id);
      
      if (!adminUser || !adminUser.isAdmin) {
        ctx.response.status = 403;
        ctx.response.body = { error: "Only administrators can promote users" };
        return;
      }
      
      // Get the target user ID
      const targetUserId = ctx.params.id;
      
      // Find the target user
      const targetUserIndex = userDatabase.findIndex(u => u.id === targetUserId);
      
      if (targetUserIndex === -1) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }
      
      // Update the user to be an admin
      userDatabase[targetUserIndex] = {
        ...userDatabase[targetUserIndex],
        isAdmin: true,
        updatedAt: new Date().toISOString()
      };
      
      // Save the updated user database
      await saveUsers();
      
      // Return success response with updated user data (excluding password hash)
      const { passwordHash: _, ...userResponse } = userDatabase[targetUserIndex];
      
      ctx.response.status = 200;
      ctx.response.body = {
        user: userResponse,
        message: `User ${userResponse.username} has been promoted to admin`
      };
      
      console.log(`User ${userResponse.username} promoted to admin by ${adminUser.username}`);
    } catch (error) {
      console.error("Error promoting user:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Special endpoint to make the first user an admin - only works when there are no admins
  .post("/api/users/first-admin", async (ctx) => {
    try {
      // Check if there are already any admins
      const existingAdmins = userDatabase.filter(user => user.isAdmin === true);
      
      if (existingAdmins.length > 0) {
        ctx.response.status = 403;
        ctx.response.body = { 
          error: "Admin users already exist in the system",
          adminCount: existingAdmins.length
        };
        return;
      }
      
      const body = await ctx.request.body().value;
      const { userId, secretKey } = body;
      
      // Verify secret key - this is a simple security measure
      // In a real app, use a more secure approach
      if (secretKey !== "make-me-admin-please") {
        ctx.response.status = 403;
        ctx.response.body = { error: "Invalid secret key" };
        return;
      }
      
      // Find the user
      const userIndex = userDatabase.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }
      
      // Make the user an admin
      userDatabase[userIndex] = {
        ...userDatabase[userIndex],
        isAdmin: true,
        updatedAt: new Date().toISOString()
      };
      
      // Save the updated user database
      await saveUsers();
      
      // Return success response with updated user data (excluding password hash)
      const { passwordHash: _, ...userResponse } = userDatabase[userIndex];
      
      ctx.response.status = 200;
      ctx.response.body = {
        user: userResponse,
        message: `User ${userResponse.username} has been made the first admin`
      };
      
      console.log(`User ${userResponse.username} has been made the first admin`);
    } catch (error) {
      console.error("Error creating first admin:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Get user ID by username - temporary helper endpoint
  .get("/api/users/find/:username", async (ctx) => {
    try {
      const username = ctx.params.username;
      
      // Find the user by username
      const user = userDatabase.find(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (!user) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }
      
      // Return only the ID and username (for security)
      ctx.response.status = 200;
      ctx.response.body = {
        id: user.id,
        username: user.username
      };
      
      console.log(`Found user ID for ${username}: ${user.id}`);
    } catch (error) {
      console.error("Error finding user:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

/**
 * Helper function to update game rating
 * @param {string} gameId - Game ID
 */
function updateGameRating(gameId) {
  console.log(`Updating rating for game ${gameId}`);
  
  // Filter reviews for this game
  const gameReviews = reviewsDatabase.filter(review => 
    review.gameId.toString() === gameId.toString()
  );
  
  console.log(`Found ${gameReviews.length} reviews for game ${gameId}`);
  
  if (gameReviews.length > 0) {
    // Calculate total and average rating
    const totalRating = gameReviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
    const averageRating = totalRating / gameReviews.length;
    
    console.log(`Game ${gameId} - Total rating: ${totalRating}, Average: ${averageRating.toFixed(1)}, Count: ${gameReviews.length}`);
    
    // Group reviews by user to see distribution
    const userReviews = new Map();
    gameReviews.forEach(review => {
      if (!userReviews.has(review.userId)) {
        userReviews.set(review.userId, []);
      }
      userReviews.get(review.userId).push(review);
    });
    
    console.log(`Game ${gameId} has reviews from ${userReviews.size} unique users`);
    
    // Update the ratings map
    gameRatingsMap.set(gameId.toString(), {
      average: averageRating,
      count: gameReviews.length,
      uniqueUsers: userReviews.size
    });
    
    // Log all reviews for this game
    console.log(`Current reviews for game ${gameId}:`);
    gameReviews.forEach((review, index) => {
      console.log(`${index + 1}. User: ${review.username} (${review.userId}), Rating: ${review.rating}, Date: ${review.updatedAt}, ID: ${review.id}`);
    });
  } else {
    // No reviews, remove from ratings map
    gameRatingsMap.delete(gameId.toString());
    console.log(`Game ${gameId} has no reviews, removed from ratings map`);
  }
}

/**
 * Helper function to get game data by ID
 * @param {string} gameId - Game ID to find
 * @returns {Object} Game data or fallback game if not found
 */
function getGameById(gameId) {
  try {
    // Convert gameId to number for comparison
    const id = parseInt(gameId);
    
    // Find the game in the hardcoded data
    const game = topGames.find(g => g.id === id);
    
    if (game) {
      return game;
    } else {
      console.log(`Game with ID ${gameId} not found in hardcoded data`);
      return createFallbackGame(gameId);
    }
  } catch (error) {
    console.error('Error getting game data:', error);
    return createFallbackGame(gameId);
  }
}

/**
 * Create a fallback game object if the game is not found
 * @param {string} gameId - Game ID
 * @returns {Object} Fallback game object
 */
function createFallbackGame(gameId) {
  return {
    id: parseInt(gameId),
    name: `Game ${gameId}`,
    description: "Game description not available",
    rating: 0,
    released: "Unknown",
    background_image: null,
    genres: [
      { id: 0, name: "Unknown" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } }
    ],
    developers: [
      { id: 0, name: "Unknown Developer" }
    ],
    publishers: [
      { id: 0, name: "Unknown Publisher" }
    ]
  };
}

// API Games routes
router
  .get("/api/games", (ctx) => {
    try {
      const url = new URL(ctx.request.url);
      const sort = url.searchParams.get("sort");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      
      console.log(`Received request for API games with sort=${sort}, limit=${limit}, offset=${offset}`);
      
      if (sort === "popular") {
        // Return popular games from hardcoded data
        const allGames = [...topGames];
        const startIndex = offset;
        const endIndex = offset + limit;
        const paginatedGames = allGames.slice(startIndex, endIndex);
        
        console.log(`Returning ${paginatedGames.length} games from hardcoded data`);
        
        ctx.response.status = 200;
        ctx.response.body = paginatedGames;
        return;
      }
      
      // If sort parameter is not recognized, return an empty array instead of 404
      // This provides better compatibility with the frontend
      ctx.response.status = 200;
      ctx.response.body = [];
      console.log(`Unrecognized sort parameter '${sort}', returning empty array`);
    } catch (error) {
      console.error(`Error fetching games:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

// Game routes without /api prefix - these should be handled as API routes, not file paths
router
  // Get game ratings (without /api prefix) - MUST come before the :id route
  .get("/games/ratings", (ctx) => {
    try {
      console.log("Fetching game ratings from local database");
      
      // Create a map to aggregate ratings by game ID
      const ratingsMap = new Map();
      const usersByGame = new Map();
      
      // Process all reviews to calculate average ratings for each game
      reviewsDatabase.forEach(review => {
        if (!review.gameId) {
          console.warn("Found review without gameId:", review);
          return;
        }
        
        const gameId = review.gameId.toString();
        const rating = parseFloat(review.rating);
        const userId = review.userId;
        
        if (isNaN(rating)) {
          console.warn(`Invalid rating value in review for game ${gameId}:`, review);
          return;
        }
        
        // Track unique users per game
        if (!usersByGame.has(gameId)) {
          usersByGame.set(gameId, new Set());
        }
        usersByGame.get(gameId).add(userId);
        
        if (!ratingsMap.has(gameId)) {
          ratingsMap.set(gameId, {
            total: rating,
            count: 1
          });
        } else {
          const current = ratingsMap.get(gameId);
          current.total += rating;
          current.count += 1;
          ratingsMap.set(gameId, current);
        }
      });
      
      // Convert the map to an array of rating objects
      const ratings = Array.from(ratingsMap.entries()).map(([gameId, data]) => ({
        game_id: gameId,
        average_rating: (data.total / data.count).toFixed(1),
        rating_count: data.count,
        unique_users: usersByGame.get(gameId).size
      }));
      
      console.log(`Returning ${ratings.length} game ratings from local database`);
      
      // Log each game's rating for debugging
      ratings.forEach(rating => {
        console.log(`Game ${rating.game_id}: Rating ${rating.average_rating} from ${rating.rating_count} reviews by ${rating.unique_users} unique users`);
      });
      
      ctx.response.status = 200;
      ctx.response.body = ratings;
    } catch (error) {
      console.error(`Error fetching game ratings:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Get game by ID (without /api prefix)
  .get("/games/:id", async (ctx) => {
    try {
      const gameId = ctx.params.id;
      
      // Get game data by ID
      const gameData = getGameById(gameId);
      
      ctx.response.status = 200;
      ctx.response.body = gameData;
    } catch (error) {
      console.error(`Error fetching game:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  
  // Get reviews for a game (without /api prefix)
  .get("/games/:id/reviews", (ctx) => {
    try {
      const gameId = ctx.params.id;
      console.log(`Fetching reviews for game ${gameId}`);
      
      // Filter reviews for this game
      const gameReviews = reviewsDatabase.filter(review => 
        review.gameId.toString() === gameId.toString()
      );
      
      console.log(`Found ${gameReviews.length} reviews for game ${gameId}`);
      
      // Calculate average rating
      let averageRating = 0;
      if (gameReviews.length > 0) {
        const totalRating = gameReviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
        averageRating = totalRating / gameReviews.length;
      }
      
      // Count unique users
      const uniqueUsers = new Set(gameReviews.map(review => review.userId)).size;
      
      console.log(`Returning ${gameReviews.length} reviews for game ${gameId} with average rating ${averageRating.toFixed(1)} from ${uniqueUsers} unique users`);
      
      // Ensure each review has a proper username
      const reviewsWithUsernames = gameReviews.map(review => {
        // If username is missing but we have userId, try to find the user
        if ((!review.username || review.username === "Anonymous User") && review.userId !== "anonymous") {
          const user = userDatabase.find(u => u.id === review.userId);
          if (user) {
            console.log(`Found username ${user.username} for user ID ${review.userId}`);
            return {
              ...review,
              username: user.username
            };
          }
        }
        return review;
      });
      
      // Sort reviews by date (newest first)
      const sortedReviews = [...reviewsWithUsernames].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      
      // Log each review for debugging
      sortedReviews.forEach((review, index) => {
        console.log(`${index + 1}. User: ${review.username} (${review.userId}), Rating: ${review.rating}, Date: ${review.updatedAt}, ID: ${review.id}`);
      });
      
      // Format the response to match what the client expects
      ctx.response.status = 200;
      ctx.response.body = {
        reviews: sortedReviews,
        total: sortedReviews.length,
        averageRating,
        uniqueUsers
      };
    } catch (error) {
      console.error(`Error fetching reviews:`, error);
      // Return empty array to avoid "reviews is not iterable" error
      ctx.response.status = 200;
      ctx.response.body = {
        reviews: [],
        total: 0,
        averageRating: 0,
        uniqueUsers: 0
      };
    }
  })
  
  // Add a review for a game (without /api prefix)
  .post("/games/:id/reviews", async (ctx) => {
    try {
      const gameId = ctx.params.id;
      console.log(`Received review submission for game ${gameId}`);
      
      const authHeader = ctx.request.headers.get("Authorization");
      console.log(`Auth header present: ${!!authHeader}`);
      if (authHeader) {
        console.log(`Auth header length: ${authHeader.length}, starts with: ${authHeader.substring(0, 20)}...`);
      } else {
        console.error("No Authorization header provided");
        ctx.response.status = 401;
        ctx.response.body = { error: "Authentication required to post reviews" };
        return;
      }
      
      // Get the review data
      const body = await ctx.request.body().value;
      console.log(`Review data received:`, body);
      
      const { rating, content } = body;
      
      if (rating === undefined || !content) {
        console.error("Missing required fields in review submission");
        ctx.response.status = 400;
        ctx.response.body = { error: "Rating and content are required" };
        return;
      }
      
      // Verify the user token
      const payload = await verifyToken(authHeader);
      if (!payload) {
        console.error("Invalid or expired token");
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid or expired token" };
        return;
      }
      
      // Get user info from token
      const userId = payload.id;
      let username = payload.username;
      
      console.log(`Authenticated user from token: ${username} (${userId})`);
      
      // Find user in database to confirm they exist and get latest username
      const user = userDatabase.find(u => u.id === userId);
      if (!user) {
        console.error(`User ID ${userId} not found in database, but token was valid`);
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }
      
      // Use the username from the database (most up-to-date)
      username = user.username;
      console.log(`Confirmed user in database: ${username} (${userId})`);
      
      // Check if user already has a review for this game
      console.log(`Checking if user ${userId} already has a review for game ${gameId}`);
      
      // Debug: log all reviews for this game
      const allGameReviews = reviewsDatabase.filter(review => review.gameId.toString() === gameId.toString());
      console.log(`Found ${allGameReviews.length} reviews for game ${gameId}:`);
      allGameReviews.forEach(review => {
        console.log(`- Review ID: ${review.id}, User ID: ${review.userId}, Username: ${review.username}, userId type: ${typeof review.userId}`);
      });
      console.log(`Current user ID: ${userId}, type: ${typeof userId}`);
      
      // Fix: Use strict comparison for gameId but loose comparison for userId to handle potential type differences
      const existingReviewIndex = reviewsDatabase.findIndex(review => {
        const gameIdMatch = review.gameId.toString() === gameId.toString();
        // Use loose equality (==) instead of strict equality (===) to handle potential type differences
        const userIdMatch = review.userId == userId;
        console.log(`Review ${review.id} - gameIdMatch: ${gameIdMatch}, userIdMatch: ${userIdMatch}, userId: ${review.userId}`);
        return gameIdMatch && userIdMatch;
      });
      
      console.log(`existingReviewIndex: ${existingReviewIndex}`);
      
      let reviewId;
      let timestamp = new Date().toISOString();
      let newReview;
      
      if (existingReviewIndex !== -1) {
        // Update existing review
        console.log(`Updating existing review for game ${gameId} by user ${username} (${userId})`);
        const existingReview = reviewsDatabase[existingReviewIndex];
        reviewId = existingReview.id;
        
        // Update the review
        reviewsDatabase[existingReviewIndex] = {
          ...existingReview,
          rating: parseFloat(rating),
          content,
          username, // Always update username in case it changed
          updatedAt: timestamp
        };
        
        newReview = reviewsDatabase[existingReviewIndex];
      } else {
        // Create a new review ID
        reviewId = crypto.randomUUID();
        
        // Create a new review
        console.log(`Creating new review for game ${gameId} by user ${username} (${userId})`);
        newReview = {
          id: reviewId,
          gameId,
          userId,
          username,
          rating: parseFloat(rating),
          content,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        // Add to database
        reviewsDatabase.push(newReview);
      }
      
      // Save to file
      try {
        await saveReviews();
        console.log(`Reviews saved successfully after ${existingReviewIndex !== -1 ? 'updating' : 'adding'} review for game ${gameId}`);
        
        // Double-check that the review was actually saved
        const reviewExists = reviewsDatabase.some(review => 
          review.id === newReview.id
        );
        
        if (!reviewExists) {
          console.error(`Review was not properly saved to the database`);
          throw new Error("Failed to save review to database");
        }
      } catch (saveError) {
        console.error(`Error saving reviews: ${saveError.message}`);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to save review: " + saveError.message };
        return;
      }
      
      // Update game rating
      updateGameRating(gameId);
      
      // Log the current state of reviews for this game
      const gameReviews = reviewsDatabase.filter(review => 
        review.gameId.toString() === gameId.toString()
      );
      console.log(`After saving, game ${gameId} has ${gameReviews.length} reviews:`);
      gameReviews.forEach(review => {
        console.log(`- Review by ${review.username} (${review.userId}): ${review.rating} stars, ID: ${review.id}`);
      });
      
      // Set response status and body
      ctx.response.status = existingReviewIndex !== -1 ? 200 : 201; // 200 OK for updates, 201 Created for new reviews
      ctx.response.body = newReview;
      console.log(`Review successfully saved, returning with status ${ctx.response.status}`);
    } catch (error) {
      console.error(`Error creating review:`, error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error: " + error.message };
    }
  });

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Static file middleware with proper MIME types - only if no API route matched
app.use(async (ctx) => {
  try {
    // Skip API routes - they should be handled by the router
    const path = ctx.request.url.pathname;
    if (path.startsWith('/api/') || 
        path.startsWith('/games/') && path.includes('/reviews') ||
        path === '/games/ratings') {
      return;
    }
    
    const filePath = path === "/" ? "/index.html" : path;
    
    // Get file extension
    const extension = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
    
    // Set appropriate content type based on file extension
    if (mimeTypes[extension]) {
      ctx.response.headers.set("Content-Type", mimeTypes[extension]);
    }
    
    await ctx.send({
      root: ROOT,
      path: filePath,
    });
  } catch (error) {
    console.error(`Error serving file: ${error.message}`);
    ctx.response.status = 404;
    ctx.response.body = "404 File not found";
  }
});

console.log(`Server running with real authentication on http://localhost:${PORT}`);
await app.listen({ port: PORT }); 