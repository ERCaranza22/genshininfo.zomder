
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
        loginLink.href = 'profile.html'; // Assuming profile.html exists or change as needed
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
    }
}

// Initialize favorite buttons and update login status on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
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

// Toggle character info on image click
function toggleInfo(imageContainer) {
    const card = imageContainer.closest('.character-card');
    const info = card.querySelector('.character-info');
    info.classList.toggle('hidden');
}
window.toggleInfo = toggleInfo;

// Show full image popup
function showPopup(event, imageUrl) {
    event.stopPropagation(); // Prevent toggling info
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popupImg.src = imageUrl;
    popup.style.display = 'flex';
    document.body.classList.add('no-scroll');
}
window.showPopup = showPopup;

// Hide the popup
function hidePopup() {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popup.style.display = 'none';
    popupImg.src = '';
    document.body.classList.remove('no-scroll');
}
window.hidePopup = hidePopup;
