document.addEventListener('DOMContentLoaded', () => {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            button.classList.toggle('active');
        });
    });
});

// Utility to get favorites from localStorage
function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
}

// Utility to save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Favorite button toggle with persistence
document.addEventListener('DOMContentLoaded', () => {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        // Get character name from the card
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
                // Remove from favorites
                favorites = favorites.filter(name => name !== charName);
            } else {
                // Add to favorites
                favorites.push(charName);
            }
            saveFavorites(favorites);
        });
    });
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
