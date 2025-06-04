// Initialize favorite buttons and update login status on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initFavoriteButtons();
    updateLoginStatus();
});

/**
 * Initialize favorite buttons and add event listeners
 */
function initFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        const card = button.closest('.character-card');
        const charName = card.querySelector('h2').textContent;

        // Initialize button state based on favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.includes(charName)) {
            button.classList.add('active');
        }

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            button.classList.toggle('active');

            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (favorites.includes(charName)) {
                favorites = favorites.filter(name => name !== charName);
                showFavoriteMessage(`${charName} removed from favorites`);
            } else {
                favorites.push(charName);
                showFavoriteMessage(`${charName} added to favorites`);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            // Update favorites page if it's open
            const favoritesPage = document.querySelector('#favorites-grid');
            if (favoritesPage) {
                renderFavorites();
            }
        });
    });
}

/**
 * Show favorite message popup
 * @param {string} message - Message to display
 */
function showFavoriteMessage(message) {
    const favoriteMessage = document.getElementById('favorite-message');
    if (favoriteMessage) {
        favoriteMessage.textContent = message;
        favoriteMessage.style.opacity = '1';
        favoriteMessage.style.display = 'block';
        
        setTimeout(() => {
            favoriteMessage.style.opacity = '0';
            setTimeout(() => {
                favoriteMessage.style.display = 'none';
            }, 500);
        }, 2000);
    }
}

// Update login status
function updateLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const loginLink = document.querySelector('.nav-links a[href="/login"]');
    if (loginLink) {
        if (currentUser.username) {
            loginLink.innerHTML = `${currentUser.username} <img src="assets/icons/user-icon.png" alt="User" class="nav-icon">`;
            loginLink.href = '/profile';
        } else {
            loginLink.textContent = 'Login';
            loginLink.href = '/login';
        }
    }
}

/**
 * Listen for changes to localStorage favorites and update favorite buttons accordingly
 * This keeps favorite button states in sync across multiple tabs/windows
 */
window.addEventListener('storage', (event) => {
    if (event.key === 'favorites') {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
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
    if (!popup) return;
    
    const popupImg = document.getElementById('popup-img');
    if (!popupImg) return;
    
    popupImg.src = imageUrl;
    popup.style.display = 'flex';
    document.body.classList.add('no-scroll');
}
window.showPopup = showPopup;

// Hide the popup
function hidePopup() {
    const popup = document.getElementById('popup');
    if (!popup) return;
    
    const popupImg = document.getElementById('popup-img');
    if (popupImg) popupImg.src = '';
    popup.style.display = 'none';
    document.body.classList.remove('no-scroll');
}
window.hidePopup = hidePopup;
