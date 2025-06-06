document.addEventListener('DOMContentLoaded', () => {
    const charactersGrid = document.getElementById('characters-grid');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loginLink = document.getElementById('login-link');
    const usernameDisplay = document.getElementById('username-display');
    const imagePopup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const closePopup = document.querySelector('.close-popup');

    let currentUser = null;

    // Check authentication status
    async function checkAuth() {
        try {
            const response = await api.auth.checkSession();
            currentUser = response.user;
            updateAuthUI();
        } catch (error) {
            console.error('Auth check failed:', error);
            currentUser = null;
            updateAuthUI();
        }
    }

    // Update UI based on auth status
    function updateAuthUI() {
        if (currentUser) {
            loginLink.href = '#';
            loginLink.onclick = handleLogout;
            usernameDisplay.textContent = currentUser.username;
        } else {
            loginLink.href = 'login.html';
            loginLink.onclick = null;
            usernameDisplay.textContent = '';
        }
    }

    // Handle logout
    async function handleLogout(e) {
        e.preventDefault();
        try {
            await api.auth.logout();
            currentUser = null;
            updateAuthUI();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    // Load characters
    async function loadCharacters() {
        try {
            loadingIndicator.style.display = 'flex';
            const response = await fetch('/api/characters');
            const characters = await response.json();
            
            // Get user's favorites if logged in
            let favorites = [];
            if (currentUser) {
                try {
                    const favResponse = await api.favorites.getFavorites();
                    favorites = favResponse.favorites || [];
                } catch (error) {
                    console.error('Failed to load favorites:', error);
                }
            }

            // Clear existing content
            charactersGrid.innerHTML = '';

            // Create character cards
            characters.forEach(character => {
                const isFavorite = favorites.includes(character.id);
                const card = createCharacterCard(character, isFavorite);
                charactersGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Failed to load characters:', error);
            charactersGrid.innerHTML = '<p class="error-message">Failed to load characters. Please try again later.</p>';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Create character card
    function createCharacterCard(character, isFavorite) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card_${character.name.toLowerCase()}`;
        
        cardDiv.innerHTML = `
            <div class="character-card">
                <div class="image-container" onclick="toggleInfo(this)">
                    <img class="character-img" src="${character.iconPath}" alt="${character.name}">
                    <img class="element-icon" src="${character.elementIconPath}" alt="${character.element}">
                </div>
                <div class="character-info hidden">
                    <h2>${character.name}</h2>
                    <div class="five-stars">${'⭐'.repeat(character.rarity)}</div>
                    <p>Weapon: ${character.weapon}</p>
                    <button onclick="showPopup(event, '${character.wishArtPath}')">Full Image</button>
                    <button class="favorite-button ${isFavorite ? 'active' : ''}" data-character-id="${character.id}">
                        ${isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;

        // Add favorite button handler
        const favoriteButton = cardDiv.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!currentUser) {
                window.location.href = 'login.html';
                return;
            }

            try {
                const characterId = favoriteButton.dataset.characterId;
                if (favoriteButton.classList.contains('active')) {
                    await api.favorites.removeFavorite(characterId);
                    favoriteButton.classList.remove('active');
                    favoriteButton.textContent = '🤍';
                } else {
                    await api.favorites.addFavorite(characterId);
                    favoriteButton.classList.add('active');
                    favoriteButton.textContent = '❤️';
                }
            } catch (error) {
                console.error('Failed to update favorite:', error);
            }
        });

        return cardDiv;
    }

    // Toggle character info
    window.toggleInfo = function(element) {
        const info = element.parentElement.querySelector('.character-info');
        info.classList.toggle('hidden');
    };

    // Show character image popup
    window.showPopup = function(event, imagePath) {
        event.stopPropagation();
        popupImage.src = imagePath;
        imagePopup.style.display = 'flex';
    };

    // Close popup on click
    closePopup.addEventListener('click', () => {
        imagePopup.style.display = 'none';
    });

    // Close popup on outside click
    imagePopup.addEventListener('click', (e) => {
        if (e.target === imagePopup) {
            imagePopup.style.display = 'none';
        }
    });

    // Initialize
    checkAuth();
    loadCharacters();
}); 