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
            await initFavoriteButtons(data.user.favorites || []);
        } else {
            updateLoginStatus();
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

async function initFavoriteButtons(favorites = []) {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    
    favoriteButtons.forEach(button => {
        const card = button.closest('.character-card');
        const charName = card.querySelector('h2').textContent;

        // Set initial state
        if (favorites.includes(charName)) {
            button.classList.add('active');
        }

        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            if (!button.closest('.character-card').querySelector('h2')) {
                console.error('Could not find character name');
                return;
            }

            try {
                if (button.classList.contains('active')) {
                    // Remove from favorites
                    const response = await fetch(`/api/favorites/${encodeURIComponent(charName)}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    
                    if (response.ok) {
                        button.classList.remove('active');
                        showFavoriteMessage(`${charName} removed from favorites`);
                    }
                } else {
                    // Add to favorites
                    const response = await fetch('/api/favorites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ character: charName })
                    });
                    
                    if (response.ok) {
                        button.classList.add('active');
                        showFavoriteMessage(`${charName} added to favorites`);
                    }
                }
            } catch (error) {
                console.error('Error updating favorites:', error);
                showFavoriteMessage('Error updating favorites. Please try again.');
            }
        });
    });
}

function updateLoginStatus(username = null) {
    const loginLink = document.querySelector('.nav-links a[href="/login"]');
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

// Toggle character info when clicking on the character image
function toggleInfo(element) {
    const card = element.closest('.character-card');
    const info = card.querySelector('.character-info');
    info.classList.toggle('hidden');
}

// Show full image popup
function showPopup(event, imageSrc) {
    event.stopPropagation();
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popupImg.src = imageSrc;
    popup.style.display = 'flex';
}

// Hide popup when clicking close button or outside
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