document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');
    const usernameDisplay = document.getElementById('username-display');
    const logoutPopup = document.getElementById('logout-popup');
    const logoutYes = document.getElementById('logout-yes');
    const logoutNo = document.getElementById('logout-no');
    const loadingOverlay = document.getElementById('loading-overlay');
    const sessionMessage = document.getElementById('session-message');
    const authMessage = document.getElementById('auth-message');
    const favoritesContent = document.getElementById('favorites-content');
    const favoritesGrid = document.getElementById('favorites-grid');

    // Check session status on page load
    checkSession();

    // Function to check session status
    async function checkSession() {
        try {
            showLoading(true);
            const response = await fetch('/api/session', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.authenticated) {
                // User is logged in
                loginLink.href = '#';
                loginLink.onclick = showLogoutPopup;
                
                // Update username display with welcome message
                usernameDisplay.textContent = `Welcome, ${data.username}!`;
                usernameDisplay.style.display = 'block';
                
                // Store username in sessionStorage for persistence
                sessionStorage.setItem('username', data.username);
                
                // Hide auth message and show favorites content
                authMessage.style.display = 'none';
                favoritesContent.classList.remove('hidden');
                
                // Load favorites
                loadFavorites();
            } else {
                // User is not logged in
                loginLink.href = '/login';
                loginLink.onclick = null;
                usernameDisplay.style.display = 'none';
                
                // Clear stored username
                sessionStorage.removeItem('username');
                
                // Show auth message and hide favorites content
                authMessage.style.display = 'flex';
                favoritesContent.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error checking session:', error);
            showMessage('Error checking session status');
        } finally {
            showLoading(false);
        }
    }

    // Function to load favorites
    async function loadFavorites() {
        try {
            showLoading(true);
            const response = await fetch('/api/favorites', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const favorites = await response.json();
                displayFavorites(favorites);
            } else {
                throw new Error('Failed to load favorites');
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            showMessage('Error loading favorites');
        } finally {
            showLoading(false);
        }
    }

    // Function to display favorites
    function displayFavorites(favorites) {
        favoritesGrid.innerHTML = '';
        
        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '<div class="no-favorites">No favorite characters yet</div>';
            return;
        }

        favorites.forEach(character => {
            const characterCard = createCharacterCard(character);
            favoritesGrid.appendChild(characterCard);
        });
    }

    // Function to create character card
    function createCharacterCard(character) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card_${character.name.toLowerCase().replace(/\s+/g, '-')}`;
        
        cardDiv.innerHTML = `
            <div class="character-card">
                <div class="image-container" onclick="toggleInfo(this)">
                    <img class="character-img" src="${character.iconUrl}" alt="${character.name}">
                    <img class="element-icon" src="${character.elementUrl}" alt="${character.element}">
                </div>
                <div class="character-info hidden">
                    <h2>${character.name}</h2>
                    <div class="${character.rarity}-stars">${'⭐'.repeat(character.rarity)}</div>
                    <p>Weapon: ${character.weapon}</p>
                    <button onclick="showPopup(event, '${character.wishUrl}')">Full Image</button>
                    <button class="favorite-button active" onclick="removeFavorite('${character.name}')">❤️</button>
                </div>
            </div>
        `;
        
        return cardDiv;
    }

    // Function to remove favorite
    async function removeFavorite(characterName) {
        try {
            const response = await fetch(`/api/favorites/${encodeURIComponent(characterName)}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                showFavoriteMessage(`${characterName} removed from favorites`);
                loadFavorites(); // Reload the favorites grid
            } else {
                throw new Error('Failed to remove favorite');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            showFavoriteMessage('Error removing favorite');
        }
    }

    // Function to show loading overlay
    function showLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // Function to show session message
    function showMessage(message) {
        sessionMessage.textContent = message;
        sessionMessage.style.display = 'block';
        setTimeout(() => {
            sessionMessage.style.display = 'none';
        }, 3000);
    }

    // Function to show favorite message
    function showFavoriteMessage(message) {
        const favoriteMessage = document.getElementById('favorite-message');
        favoriteMessage.textContent = message;
        favoriteMessage.style.display = 'block';
        favoriteMessage.style.opacity = '1';
        
        setTimeout(() => {
            favoriteMessage.style.opacity = '0';
            setTimeout(() => {
                favoriteMessage.style.display = 'none';
            }, 500);
        }, 2000);
    }

    // Function to show logout popup
    function showLogoutPopup(event) {
        event.preventDefault();
        logoutPopup.style.display = 'flex';
    }

    // Handle logout confirmation
    logoutYes.addEventListener('click', async function() {
        try {
            showLoading(true);
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                // Clear stored username
                sessionStorage.removeItem('username');
                showMessage('Logged out successfully');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            showMessage('Error during logout');
        } finally {
            showLoading(false);
            logoutPopup.style.display = 'none';
        }
    });

    // Handle logout cancellation
    logoutNo.addEventListener('click', function() {
        logoutPopup.style.display = 'none';
    });

    // Existing functions for character info and popup
    window.toggleInfo = function(element) {
        const info = element.parentElement.querySelector('.character-info');
        info.classList.toggle('hidden');
    };

    window.showPopup = function(event, imageSrc) {
        event.stopPropagation();
        const popup = document.getElementById('popup');
        const popupImg = document.getElementById('popup-img');
        popupImg.src = imageSrc;
        popup.style.display = 'block';
    };

    window.hidePopup = function() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
    };

    // Close popup when clicking outside
    window.onclick = function(event) {
        const popup = document.getElementById('popup');
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    };

    // Make removeFavorite function available globally
    window.removeFavorite = removeFavorite;
});