/**
 * Utility to get favorites from localStorage
 * @returns {Array} Array of favorite character names
 */
function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
}

/**
 * Utility to save favorites to localStorage
 * @param {Array} favorites - Array of favorite character names
 */
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

let favoriteMessageTimeout = null;

/**
 * Show favorite message popup with character name and action
 * @param {string} characterName - Name of the character
 * @param {string} action - Action message (e.g. 'added to favorites')
 */
function showFavoriteMessage(characterName, action) {
    const favoriteMessage = document.getElementById('favorite-message');
    favoriteMessage.textContent = `${characterName} ${action}`;
    favoriteMessage.style.display = 'block';
    favoriteMessage.style.opacity = '1';

    if (favoriteMessageTimeout) {
        clearTimeout(favoriteMessageTimeout);
    }

    favoriteMessageTimeout = setTimeout(() => {
        favoriteMessage.style.opacity = '0';
        setTimeout(() => {
            favoriteMessage.style.display = 'none';
        }, 500);
    }, 2000);
}

/**
 * Initialize favorite buttons and add event listeners
 */
function initFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        const card = button.closest('.character-card');
        const charName = card.querySelector('h2').textContent;

        // Initialize button state based on favorites
        const favorites = getFavorites();
        if (favorites.includes(charName)) {
            button.classList.add('active');
        }

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            button.classList.toggle('active');

            let favorites = getFavorites();
            if (favorites.includes(charName)) {
                favorites = favorites.filter(name => name !== charName);
                showFavoriteMessage(charName, 'removed from favorites');
            } else {
                favorites.push(charName);
                showFavoriteMessage(charName, 'added to favorites');
            }
            saveFavorites(favorites);
        });
    });
}

function updateLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.querySelector('.nav-links a[href="login.html"]');
    if (!loginLink) return;
    if (currentUser) {
        loginLink.textContent = 'Profile';
        loginLink.href = 'profile.html';
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = '/login';
    }
}

// Initialize favorite buttons and update login status on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Initialize favorites
    let favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.username}`) || '[]');
    
    // Update favorites display
    updateFavoritesDisplay();
    
    // Add click handlers for favorite buttons
    document.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.character-card');
            const characterName = card.querySelector('h2').textContent;
            toggleFavorite(characterName);
        });
    });

    // Toggle character info
    window.toggleInfo = function(element) {
        const info = element.nextElementSibling;
        info.classList.toggle('hidden');
    };

    // Show character popup
    window.showPopup = function(event, imageSrc) {
        event.stopPropagation();
        const popup = document.getElementById('popup');
        const popupImg = document.getElementById('popup-img');
        popupImg.src = imageSrc;
        popup.style.display = 'flex';
    };

    // Hide character popup
    window.hidePopup = function() {
        const popup = document.getElementById('popup');
        const popupImg = document.getElementById('popup-img');
        popup.style.display = 'none';
        popupImg.src = '';
    };

    // Close popup when clicking outside
    document.getElementById('popup').addEventListener('click', (e) => {
        if (e.target === document.getElementById('popup')) {
            hidePopup();
        }
    });

    // Toggle favorite
    function toggleFavorite(characterName) {
        const index = favorites.indexOf(characterName);
        if (index === -1) {
            favorites.push(characterName);
            showMessage(`${characterName} added to favorites`);
        } else {
            favorites.splice(index, 1);
            showMessage(`${characterName} removed from favorites`);
        }
        
        // Save to localStorage
        localStorage.setItem(`favorites_${currentUser.username}`, JSON.stringify(favorites));
        
        // Update display
        updateFavoritesDisplay();
    }

    // Update favorites display
    function updateFavoritesDisplay() {
        document.querySelectorAll('.favorite-button').forEach(button => {
            const card = button.closest('.character-card');
            const characterName = card.querySelector('h2').textContent;
            if (favorites.includes(characterName)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Show message
    function showMessage(message) {
        const messageElement = document.getElementById('favorite-message');
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        messageElement.style.opacity = '1';
        
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 500);
        }, 2000);
    }

    initFavoriteButtons();
    updateLoginStatus();
});

/**
 * Listen for changes to localStorage favorites and update favorite buttons accordingly
 * This keeps favorite button states in sync across multiple tabs/windows
 */
window.addEventListener('storage', (event) => {
    if (event.key === 'favorites') {
        const favorites = getFavorites();
        const favoriteButtons = document.querySelectorAll('.favorite-button');
        favoriteButtons.forEach(button => {
            const card = button.closest('.character-card');
            const charName = card.querySelector('h2').textContent;
            if (favorites.includes(charName)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
});
