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

/**
 * Character data mapping for rendering favorite cards
 */
const characterData = {
    "Albedo": {
        icon: "assets/characters/icon/Albedo_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Albedo.png"
    },
    "Amber": {
        icon: "assets/characters/icon/Amber_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Amber.png"
    },
    // Add other characters similarly...
};

/**
 * Create a character card element for favorites page
 * @param {string} name - Character name
 * @param {object} data - Character data object
 * @returns {HTMLElement} Character card element
 */
function createCharacterCard(name, data) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card_${name.toLowerCase().replace(/\s+/g, '_')}`;

    cardDiv.innerHTML = `
        <div class="character-card">
            <div class="image-container" onclick="toggleInfo(this)">
                <img class="character-img" src="${data.icon}" alt="${name}">
                <img class="element-icon" src="${data.element}" alt="${data.elementAlt}">
            </div>
            <div class="character-info hidden">
                <h2>${name}</h2>
                <div class="stars">${data.stars}</div>
                <p>Weapon: ${data.weapon}</p>
                <button onclick="showPopup(event, '${data.fullImage}')">Full Image</button>
                <button class="remove-favorite-button">Remove</button>
            </div>
        </div>
    `;
    // Add event listener for remove button
    cardDiv.querySelector('.remove-favorite-button').addEventListener('click', () => {
        let favorites = getFavorites();
        favorites = favorites.filter(fav => fav !== name);
        saveFavorites(favorites);
        renderFavorites();
    });
    return cardDiv;
}

/**
 * Render favorites on favorites.html
 */
function renderFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    if (!favoritesGrid) return;

    favoritesGrid.innerHTML = '';

    const favorites = getFavorites();
    if (favorites.length === 0) {
        favoritesGrid.textContent = 'No favorites added yet.';
        return;
    }

    favorites.forEach(name => {
        const data = characterData[name];
        if (data) {
            const card = createCharacterCard(name, data);
            favoritesGrid.appendChild(card);
        }
    });
}

/**
 * Toggle character info on image click
 * @param {HTMLElement} imageContainer - The image container element
 */
function toggleInfo(imageContainer) {
    const card = imageContainer.closest('.character-card');
    const info = card.querySelector('.character-info');
    info.classList.toggle('hidden');
}

/**
 * Show full image popup
 * @param {Event} event - Click event
 * @param {string} imageUrl - URL of the full image
 */
function showPopup(event, imageUrl) {
    event.stopPropagation();
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popupImg.src = imageUrl;
    popup.style.display = 'flex';
    document.body.classList.add('no-scroll');
}

/**
 * Hide the popup
 */
function hidePopup() {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popup.style.display = 'none';
    popupImg.src = '';
    document.body.classList.remove('no-scroll');
}

// Close popup when clicking outside the image
document.addEventListener('click', (e) => {
    const popup = document.getElementById('popup');
    if (popup.style.display === 'flex' && !e.target.closest('.popup-content')) {
        hidePopup();
    }
});

// Initial render on page load
document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
    updateLoginStatus();
});

/**
 * Update the login link text and href based on login state
 */
function updateLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    if (!loginLink) return;

    if (currentUser) {
        loginLink.textContent = 'Profile';
        loginLink.href = 'profile.html'; // Adjust if needed

        // Add click event to toggle logout
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle logout: clear currentUser and update UI
            localStorage.removeItem('currentUser');
            updateLoginStatus();
        });
    } else {
        loginLink.textContent = '';
        const userIcon = document.createElement('img');
        userIcon.src = 'assets/icons/user-icon.png';
        userIcon.alt = 'Login';
        userIcon.className = 'nav-icon';
        loginLink.href = 'login.html';
        loginLink.innerHTML = '';
        loginLink.appendChild(userIcon);

        // Remove any previous click event listeners by cloning
        const newLoginLink = loginLink.cloneNode(true);
        loginLink.parentNode.replaceChild(newLoginLink, loginLink);
    }
}

// Listen for changes to localStorage favorites and update the favorites grid dynamically
window.addEventListener('storage', (event) => {
    if (event.key === 'favorites') {
        renderFavorites();
    }
});
