document.addEventListener('DOMContentLoaded', () => {
    const imagePopup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const closePopup = document.querySelector('.close-popup');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const favoriteMessage = document.getElementById('favorite-message');

    // Hide loading indicator
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }

    // Toggle character info
    window.toggleInfo = function(element) {
        const info = element.parentElement.querySelector('.character-info');
        if (info) {
            info.classList.toggle('hidden');
        }
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

    // Load favorites from API
    async function loadFavorites() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return {};

            const response = await fetch('/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return {};
            }

            if (!response.ok) {
                throw new Error('Failed to load favorites');
            }

            const favorites = await response.json();
            return favorites.reduce((acc, char) => {
                acc[char.name] = char;
                return acc;
            }, {});
        } catch (error) {
            console.error('Error loading favorites:', error);
            return {};
        }
    }

    // Show favorite message popup
    function showFavoriteMessage(message, isError = false) {
        favoriteMessage.textContent = message;
        favoriteMessage.classList.add('show');
        if (isError) {
            favoriteMessage.classList.add('error');
        } else {
            favoriteMessage.classList.remove('error');
        }
        
        setTimeout(() => {
            favoriteMessage.classList.remove('show', 'error');
        }, 2000);
    }

    // Handle favorite buttons
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(async button => {
        const characterCard = button.closest('.character-card');
        const characterName = characterCard.querySelector('h2').textContent;
        const characterImg = characterCard.querySelector('.character-img').src;
        const elementImg = characterCard.querySelector('.element-icon').src;
        const stars = characterCard.querySelector('.five-stars, .four-stars').innerHTML;
        const weapon = characterCard.querySelector('p').textContent.replace('Weapon: ', '');

        // Check if character is already in favorites
        const favorites = await loadFavorites();
        if (favorites[characterName]) {
            button.classList.add('active');
        }

        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            const token = localStorage.getItem('token');
            if (!token) {
                showFavoriteMessage('Please login to add favorites', true);
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
                return;
            }

            try {
                if (button.classList.contains('active')) {
                    // Remove from favorites
                    const response = await fetch(`/api/favorites/${encodeURIComponent(characterName)}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 401) {
                        // Token expired or invalid
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        showFavoriteMessage('Session expired. Please login again', true);
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 2000);
                        return;
                    }

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Failed to remove favorite');
                    }
                    
                    button.classList.remove('active');
                    showFavoriteMessage('Removed from favorites');
                } else {
                    // Add to favorites
                    const response = await fetch('/api/favorites/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: characterName,
                            image: characterImg,
                            element: elementImg,
                            stars: stars,
                            weapon: weapon
                        })
                    });

                    if (response.status === 401) {
                        // Token expired or invalid
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        showFavoriteMessage('Session expired. Please login again', true);
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 2000);
                        return;
                    }

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Failed to add favorite');
                    }
                    
                    button.classList.add('active');
                    showFavoriteMessage('Added to favorites');
                }
            } catch (error) {
                console.error('Error updating favorites:', error);
                showFavoriteMessage(error.message || 'Error updating favorites', true);
            }
        });
    });
}); 