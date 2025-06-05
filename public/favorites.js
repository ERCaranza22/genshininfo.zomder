document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndInitialize();
});

async function checkAuthAndInitialize() {
    try {
        const response = await fetch('/api/session', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
            updateLoginStatus(data.user.username);
            // Show favorites content and load favorites
            document.getElementById('auth-message').style.display = 'none';
            document.getElementById('favorites-content').style.display = 'block';
            await loadFavorites();
        } else {
            updateLoginStatus();
            // Show auth message and hide favorites content
            document.getElementById('auth-message').style.display = 'flex';
            document.getElementById('favorites-content').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        showFavoriteMessage('Error checking authentication status');
    }
}

async function loadFavorites() {
    try {
        const response = await fetch('/api/favorites', {
            credentials: 'include'
        });
        const data = await response.json();
        const favoritesGrid = document.getElementById('favorites-grid');

        if (data.favorites && data.favorites.length > 0) {
            favoritesGrid.innerHTML = ''; // Clear existing content
            data.favorites.forEach(character => {
                const card = createCharacterCard(character);
                favoritesGrid.appendChild(card);
            });
        } else {
            favoritesGrid.innerHTML = '<div class="no-favorites">You haven\'t added any favorites yet!</div>';
        }
    } catch (error) {
        console.error('Failed to load favorites:', error);
        showFavoriteMessage('Error loading favorites');
    }
}

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
        <div class="character-image" onclick="showPopup('${character.image}')">
            <img src="${character.image}" alt="${character.name}" loading="lazy">
        </div>
        <div class="character-info">
            <h3>${character.name}</h3>
            <p>Vision: ${character.vision}</p>
            <p>Weapon: ${character.weapon}</p>
            <p>Nation: ${character.nation}</p>
            <button class="heart-btn active" data-character="${character.name}">
                <img src="assets/icons/heart-filled.png" alt="Remove from favorites">
            </button>
        </div>
    `;

    // Add event listener for the heart button
    const heartBtn = card.querySelector('.heart-btn');
    heartBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/favorites/${encodeURIComponent(character.name)}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if (response.ok) {
                showFavoriteMessage(`${character.name} removed from favorites`);
                await loadFavorites(); // Reload the favorites grid
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            showFavoriteMessage('Error updating favorites. Please try again.');
        }
    });

    return card;
}

function updateLoginStatus(username = null) {
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        if (username) {
            loginLink.innerHTML = `${username} <img src="assets/icons/user-icon.png" alt="User" class="nav-icon">`;
            loginLink.href = '#';
            loginLink.addEventListener('click', showLogoutPopup);
        } else {
            loginLink.innerHTML = '<img src="assets/icons/user-icon.png" alt="Login" class="nav-icon">';
            loginLink.href = '/login';
        }
    }
}

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

// Popup functionality
function showPopup(imageSrc) {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popupImg.src = imageSrc;
    popup.style.display = 'flex';
}

function hidePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Close popup when clicking outside the image
document.getElementById('popup').addEventListener('click', function(event) {
    if (event.target === this) {
        hidePopup();
    }
});

// Show logout popup
function showLogoutPopup() {
    const logoutPopup = document.getElementById('logout-popup');
    logoutPopup.style.display = 'flex';
    
    // Add event listeners for yes/no buttons
    document.getElementById('logout-yes').onclick = async function() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    
    document.getElementById('logout-no').onclick = function() {
        logoutPopup.style.display = 'none';
    };
}