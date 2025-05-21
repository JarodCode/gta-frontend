/**
 * Fallback implementation of app.js functionality
 * Used when module loading fails due to MIME type issues
 */

import { getCurrentUser, logout } from './mock-auth.js';

// Initialize the app by loading the header and footer
export async function initApp() {
    loadHeader();
    loadFooter();
    setupAuthUI();
}

// Load the header with navigation
function loadHeader() {
    const headerElement = document.getElementById('main-header');
    if (!headerElement) return;
    
    headerElement.innerHTML = `
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="../index.html">Game Library</a>
                </div>
                <nav>
                    <ul>
                        <li><a href="../index.html" ${isCurrentPage('index.html') ? 'class="active"' : ''}>Home</a></li>
                        <li><a href="../pages/games/list.html" ${isCurrentPage('games/list.html') ? 'class="active"' : ''}>Games</a></li>
                        <li><a href="../pages/developers.html" ${isCurrentPage('developers.html') ? 'class="active"' : ''}>Developers</a></li>
                        <li><a href="../pages/publishers.html" ${isCurrentPage('publishers.html') ? 'class="active"' : ''}>Publishers</a></li>
                        <li><a href="../pages/genres.html" ${isCurrentPage('genres.html') ? 'class="active"' : ''}>Genres</a></li>
                        <li id="auth-links">
                            <a href="../pages/login/index.html">Login</a>
                            <a href="../pages/register/index.html">Register</a>
                        </li>
                        <li id="user-menu" style="display: none;">
                            <button id="user-menu-button">
                                <span id="username-display">User</span>
                                <span class="dropdown-arrow">▼</span>
                            </button>
                            <div id="user-dropdown" class="dropdown-menu">
                                <a href="../pages/profile.html">Profile</a>
                                <a href="#" id="logout-button">Logout</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    `;
    
    // Fix paths based on current location
    fixRelativePaths();
}

// Load the footer
function loadFooter() {
    const footerElement = document.getElementById('main-footer');
    if (!footerElement) return;
    
    footerElement.innerHTML = `
        <div class="container">
            <p>&copy; 2023 Game Library. All rights reserved.</p>
        </div>
    `;
}

// Set up the auth UI based on login status
function setupAuthUI() {
    const user = getCurrentUser();
    const authLinks = document.getElementById('auth-links');
    const userMenu = document.getElementById('user-menu');
    
    if (!authLinks || !userMenu) return;
    
    if (user) {
        // User is logged in
        authLinks.style.display = 'none';
        userMenu.style.display = 'block';
        
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = user.username;
        }
        
        // Set up user menu dropdown
        const userMenuButton = document.getElementById('user-menu-button');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuButton && userDropdown) {
            userMenuButton.addEventListener('click', (e) => {
                userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (e.target !== userMenuButton && !userMenuButton.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
        }
        
        // Set up logout functionality
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
                window.location.reload();
            });
        }
    } else {
        // User is not logged in
        authLinks.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// Helper function to check if we're on a specific page
function isCurrentPage(pagePath) {
    const currentPath = window.location.pathname;
    return currentPath.endsWith(pagePath);
}

// Fix relative paths based on the current location
function fixRelativePaths() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('a');
    
    // Determine if we're in a subdirectory
    const inSubdir = currentPath.split('/').filter(Boolean).length > 2;
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('../')) {
            // Already a relative path, fix it based on depth
            if (inSubdir && href.startsWith('../index.html')) {
                link.setAttribute('href', href.replace('../', '../../'));
            }
        }
    });
} 