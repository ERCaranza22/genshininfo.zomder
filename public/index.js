document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');
    const usernameDisplay = document.getElementById('username-display');
    const logoutPopup = document.getElementById('logout-popup');
    const logoutYes = document.getElementById('logout-yes');
    const logoutNo = document.getElementById('logout-no');
    const loadingOverlay = document.getElementById('loading-overlay');
    const sessionMessage = document.getElementById('session-message');

    // Check session status and initialize favorites on page load
    checkSessionAndInitialize();

    // Function to check session and initialize favorites
    async function checkSessionAndInitialize() {
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

                // Initialize favorite states
                await initializeFavorites();
            } else {
                // User is not logged in
                loginLink.href = '/login';
                loginLink.onclick = null;
                usernameDisplay.style.display = 'none';
                
                // Clear stored username
                sessionStorage.removeItem('username');

                // Reset all favorite buttons to unfavorited state
                document.querySelectorAll('.favorite-button').forEach(button => {
                    button.textContent = '🤍';
                });
            }
        } catch (error) {
            console.error('Error checking session:', error);
            showMessage('Error checking session status');
        } finally {
            showLoading(false);
        }
    }

    // Function to initialize favorite states
    async function initializeFavorites() {
        try {
            const response = await fetch('/api/favorites', {
                credentials: 'include'
            });

            if (response.ok) {
                const favorites = await response.json();
                
                // Reset all buttons first
                document.querySelectorAll('.favorite-button').forEach(button => {
                    const characterCard = button.closest('.character-card');
                    const characterName = characterCard.querySelector('h2').textContent;
                    button.textContent = favorites.includes(characterName) ? '❤️' : '🤍';
                });
            }
        } catch (error) {
            console.error('Error initializing favorites:', error);
            showMessage('Error loading favorites');
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

    // Handle favorite button clicks
    document.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', async function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const characterCard = this.closest('.character-card');
            const characterName = characterCard.querySelector('h2').textContent;

            try {
                const response = await fetch('/api/session', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (!data.authenticated) {
                    // Save the current URL and redirect to login
                    window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                    return;
                }

                // Handle favoriting logic
                const favoriteResponse = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ characterName }),
                    credentials: 'include'
                });

                if (favoriteResponse.ok) {
                    const result = await favoriteResponse.json();
                    this.textContent = result.isFavorited ? '❤️' : '🤍';
                    showFavoriteMessage(result.message);
                } else {
                    throw new Error('Failed to update favorite');
                }
            } catch (error) {
                console.error('Error updating favorite:', error);
                showFavoriteMessage('Error updating favorite');
            }
        });
    });

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
});