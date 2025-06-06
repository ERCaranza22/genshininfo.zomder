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
    },


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

        // Show removal message
        const messageDiv = document.getElementById('favorite-message');
        if (messageDiv) {
            messageDiv.textContent = `${name} removed from favorites.`;
            // Clear message after 3 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 3000);
        }
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

// Check session status before loading favorites
async function checkSession() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/login';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Session check failed:', error);
        window.location.href = '/login';
        return false;
    }
}

// Modify the initial render to check session first
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkSession();
    if (isAuthenticated) {
        renderFavorites();
        updateLoginStatus();
    }
});

/**
 * Update the login link text and href based on login state
 */
function updateLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    if (!loginLink) return;    if (currentUser) {
        loginLink.textContent = 'Profile';
        loginLink.href = '/profile'; // Adjust if needed

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
        loginLink.href = '/login';
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
