// This file is no longer needed as favorites functionality has been removed 

document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favorites-grid');
    const noFavoritesMessage = document.getElementById('no-favorites');
    const favoriteMessage = document.getElementById('favorite-message');
    const imagePopup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const closePopup = document.querySelector('.close-popup');

    // Load favorites from API
    async function loadFavorites() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            const response = await fetch('/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load favorites');
            }

            const favorites = await response.json();
            favoritesGrid.innerHTML = '';

            if (favorites.length === 0) {
                noFavoritesMessage.style.display = 'block';
                return;
            }

            noFavoritesMessage.style.display = 'none';
            favorites.forEach(character => {
                const characterCard = createCharacterCard(character);
                favoritesGrid.appendChild(characterCard);
            });
        } catch (error) {
            console.error('Error loading favorites:', error);
            showFavoriteMessage('Error loading favorites');
        }
    }

    // Create character card element
    function createCharacterCard(character) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'character-card';
        cardDiv.innerHTML = `
            <div class="image-container">
                <img class="character-img" src="${character.image}" alt="${character.name}">
                <img class="element-icon" src="${character.element}" alt="Element">
            </div>
            <div class="character-info">
                <h2>${character.name}</h2>
                <div class="stars">${character.stars}</div>
                <p>${character.weapon}</p>
                <button onclick="showPopup(event, '${character.image.replace('icon', 'wish')}')">Full Image</button>
                <button class="favorite-button active">❤️</button>
            </div>
        `;

        // Add remove favorite functionality
        const favoriteButton = cardDiv.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login.html';
                    return;
                }

                const response = await fetch(`/api/favorites/${encodeURIComponent(character.name)}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to remove favorite');
                }

                cardDiv.style.opacity = '0';
                showFavoriteMessage('Removed from favorites');

                setTimeout(() => {
                    cardDiv.remove();
                    if (favoritesGrid.children.length === 0) {
                        noFavoritesMessage.style.display = 'block';
                    }
                }, 500);
            } catch (error) {
                console.error('Error removing favorite:', error);
                showFavoriteMessage('Error removing favorite');
            }
        });

        return cardDiv;
    }

    // Show popup image
    window.showPopup = function(event, imagePath) {
        event.stopPropagation();
        popupImage.src = imagePath;
        imagePopup.style.display = 'flex';
    };

    // Close popup
    closePopup.addEventListener('click', () => {
        imagePopup.style.display = 'none';
    });

    imagePopup.addEventListener('click', (e) => {
        if (e.target === imagePopup) {
            imagePopup.style.display = 'none';
        }
    });

    // Show favorite message popup
    function showFavoriteMessage(message) {
        favoriteMessage.textContent = message;
        favoriteMessage.style.opacity = '1';
        favoriteMessage.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            favoriteMessage.style.opacity = '0';
            favoriteMessage.style.transform = 'translateY(20px)';
        }, 2000);
    }

    // Initial load
    loadFavorites();
}); 