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
 * Remove a character from favorites
 * @param {string} character - Name of the character to remove
 */
function removeFavorite(character) {
    try {
        // Get current favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        // Check if character exists in favorites
        const index = favorites.indexOf(character);
        if (index === -1) {
            showMessage(`${character} not found in favorites`);
            return;
        }

        // Remove character from favorites
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Update UI
        renderFavorites();
        showMessage(`${character} removed from favorites`);
    } catch (error) {
        console.error('Error removing favorite:', error);
        showMessage('Failed to remove favorite. Please try again.');
    }
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
    "Arlecchino": {
        icon: "assets/characters/icon/Arlecchino_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Arlecchino.png"
    },

    "Bennett": {
        icon: "assets/characters/icon/Bennett_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Bennett.png"
    },

    "Diluc": {
        icon: "assets/characters/icon/Diluc_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Claymore",
        fullImage: "assets/characters/wish/Diluc.png"
    },

    "Diona": {
        icon: "assets/characters/icon/Diona_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Diona.png"
    },

    "Eula": {
        icon: "assets/characters/icon/Eula_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Claymore",
        fullImage: "assets/characters/wish/Eula.png"
    },

    "Fischl": {
        icon: "assets/characters/icon/Fischl_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Fischl.png"
    },

    "Ganyu": {
        icon: "assets/characters/icon/Ganyu_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Ganyu.png"
    },

    "HuTao": {
        icon: "assets/characters/icon/Hu_Tao_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Hu_Tao.png"
    },

    "KaedeharaKazuha": {
        icon: "assets/characters/icon/Kaedehara_Kazuha_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Kaedehara_Kazuha.png"
    },

    "KamisatoAyaka": {
        icon: "assets/characters/icon/Kamisato_Ayaka_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Kamisato_Ayaka.png"
    },

    "KamisatoAyato": {
        icon: "assets/characters/icon/Kamisato_Ayato_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Kamisato_Ayato.png"
    },

    "Keqing": {
        icon: "assets/characters/icon/Keqing_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Keqing.png"
    },

    "Klee": {
        icon: "assets/characters/icon/Klee_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Klee.png"
    },

    "KukiShinobu": {
        icon: "assets/characters/icon/Kuki_Shinobu_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Kuki_Shinobu.png"
    },

    "Mona": {
        icon: "assets/characters/icon/Mona_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Mona.png"
    },

    "Ningguang": {
        icon: "assets/characters/icon/Ningguang_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Ningguang.png"
    },

    "Noelle": {
        icon: "assets/characters/icon/Noelle_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐",
        weapon: "Claymore",
        fullImage: "assets/characters/wish/Noelle.png"
    },

    "RaidenShogun": {
        icon: "assets/characters/icon/Raiden_Shogun_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Raiden_Shogun.png"
    },

    "ShikanoinHeizou": {
        icon: "assets/characters/icon/Shikanoin_Heizou_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Shikanoin_Heizou.png"
    },

    "Sucrose": {
        icon: "assets/characters/icon/Sucrose_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Sucrose.png"
    },

    "Tartaglia": {
        icon: "assets/characters/icon/Tartaglia_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Tartaglia.png"
    },

    "Venti": {
        icon: "assets/characters/icon/Venti_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Venti.png"
    },

    "Xiao": {
        icon: "assets/characters/icon/Xiao_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Xiao.png"
    },

    "Xingqiu": {
        icon: "assets/characters/icon/Xingqiu_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Xingqiu.png"
    },

    "YaeMiko": {
        icon: "assets/characters/icon/Yae_Miko_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Yae_Miko.png"
    },

    "Yanfei": {
        icon: "assets/characters/icon/Yanfei_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Yanfei.png"
    },

    "Yelan": {
        icon: "assets/characters/icon/Yelan_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Yelan.png"
    },

    "Yoimiya": {
        icon: "assets/characters/icon/Yoimiya_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Yoimiya.png"
    },

    "Zhongli": {
        icon: "assets/characters/icon/Zhongli_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Zhongli.png"
    }
};

// Initialize favorites page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status first
    checkAuthAndLoadFavorites();
});

/**
 * Render favorites on favorites.html
 */
function renderFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    if (!favoritesGrid) return;
    
    favoritesGrid.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) {
        favoritesGrid.textContent = 'No character added here';
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

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndLoadFavorites();
});

function checkAuthAndLoadFavorites() {
    fetch('/api/session')
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                return;
            }
            loadFavorites();
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            showMessage('Error checking authentication status');
        });
}

function loadFavorites() {
    fetch('/api/favorites')
        .then(response => response.json())
        .then(data => {
            const favoritesGrid = document.getElementById('favorites-grid');
            if (data.favorites && data.favorites.length > 0) {
                favoritesGrid.innerHTML = ''; // Clear existing content
                data.favorites.forEach(character => {
                    const card = createCharacterCard(character);
                    favoritesGrid.appendChild(card);
                });
            } else {
                favoritesGrid.innerHTML = '<p class="no-favorites">No favorite characters yet.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading favorites:', error);
            showMessage('Error loading favorites');
        });
}

/**
 * Create a character card element
 * @param {string} characterName - Name of the character
 * @returns {HTMLElement} Character card element
 */
function createCharacterCard(characterName) {
    const card = document.createElement('div');
    card.className = 'character-card';

    const data = characterData[characterName];
    if (!data) return null;

    card.innerHTML = `
        <div class="image-container" onclick="toggleInfo(this)">
            <img class="character-img" src="${data.icon}" alt="${characterName}">
            <img class="element-icon" src="${data.element}" alt="${data.elementAlt}">
        </div>
        <div class="character-info hidden">
            <h2>${characterName}</h2>
            <div class="stars">${data.stars}</div>
            <p>Weapon: ${data.weapon}</p>
            <button onclick="showPopup(event, '${data.fullImage}')">Full Image</button>
            <button class="remove-favorite-button" onclick="removeFavorite('${characterName}')">Remove</button>
        </div>
    `;

    // Add event listener for remove button
    const removeButton = card.querySelector('.remove-favorite-button');
    if (removeButton) {
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent info toggle
            removeFavorite(characterName);
        });
    }

    return card;
}

function removeFavorite(character) {
    fetch('/api/favorites/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ character })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message.includes('removed')) {
            loadFavorites(); // Reload the favorites grid
            showMessage(`${character} removed from favorites`);
        } else {
            showMessage(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Error removing favorite');
    });
}

/**
 * Show message
 * @param {string} message - Message to display
 */
function showMessage(message) {
    const messageElement = document.getElementById('favorite-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.opacity = '1';
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 500);
        }, 3000);
    }
}

// Handle logout
document.getElementById('logout-yes').addEventListener('click', function() {
    fetch('/api/logout', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem('currentUser');
                window.location.href = '/login';
            }
        })
        .catch(error => console.error('Error during logout:', error));
});

document.getElementById('logout-no').addEventListener('click', function() {
    document.getElementById('logout-popup').style.display = 'none';
});

// Listen for changes to localStorage favorites and update the favorites grid dynamically
window.addEventListener('storage', (event) => {
    if (event.key === 'favorites') {
        const favoritesGrid = document.getElementById('favorites-grid');
        if (favoritesGrid) {
            renderFavorites();
        }
    }
});
