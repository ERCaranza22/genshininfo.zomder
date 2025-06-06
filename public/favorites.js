document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favorites-grid');
    const noFavoritesMessage = document.getElementById('no-favorites');
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
            if (!currentUser) {
                window.location.href = 'login.html';
                return;
            }
            updateAuthUI();
            loadFavorites();
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = 'login.html';
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
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    // Load favorite characters
    async function loadFavorites() {
        try {
            loadingIndicator.style.display = 'flex';
            const response = await api.favorites.getFavorites();
            const favorites = response.favorites || [];

            if (favorites.length === 0) {
                noFavoritesMessage.style.display = 'block';
                favoritesGrid.style.display = 'none';
                return;
            }

            // Get character details for favorites
            const charactersResponse = await fetch('/api/characters');
            const allCharacters = await charactersResponse.json();
            
            // Filter characters to only show favorites
            const favoriteCharacters = allCharacters.filter(char => 
                favorites.includes(char.id)
            );

            // Clear existing content
            favoritesGrid.innerHTML = '';
            favoritesGrid.style.display = 'grid';
            noFavoritesMessage.style.display = 'none';

            // Create character cards
            favoriteCharacters.forEach(character => {
                const card = createCharacterCard(character);
                favoritesGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Failed to load favorites:', error);
            favoritesGrid.innerHTML = '<p class="error-message">Failed to load favorites. Please try again later.</p>';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Create character card
    function createCharacterCard(character) {
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
                    <button class="favorite-button active" data-character-id="${character.id}">❤️</button>
                </div>
            </div>
        `;

        // Add favorite button handler
        const favoriteButton = cardDiv.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                const characterId = favoriteButton.dataset.characterId;
                await api.favorites.removeFavorite(characterId);
                
                // Remove the card with animation
                cardDiv.style.opacity = '0';
                setTimeout(() => {
                    cardDiv.remove();
                    
                    // Check if there are any favorites left
                    if (favoritesGrid.children.length === 0) {
                        favoritesGrid.style.display = 'none';
                        noFavoritesMessage.style.display = 'block';
                    }
                }, 300);
                
            } catch (error) {
                console.error('Failed to remove favorite:', error);
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
}); 