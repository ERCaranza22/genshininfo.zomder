// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Handle logout
function logout(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Create and show the confirmation popup
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'confirm-popup';
    confirmPopup.innerHTML = `
        <div class="confirm-popup-content">
            <h2>Want to log out?</h2>
            <div class="confirm-popup-buttons">
                <button class="confirm-yes">Yes</button>
                <button class="confirm-no">No</button>
            </div>
        </div>
    `;

    // Add the popup to the body
    document.body.appendChild(confirmPopup);

    // Handle button clicks
    confirmPopup.querySelector('.confirm-yes').addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    confirmPopup.querySelector('.confirm-no').addEventListener('click', () => {
        document.body.removeChild(confirmPopup);
    });

    // Close popup when clicking outside
    confirmPopup.addEventListener('click', (e) => {
        if (e.target === confirmPopup) {
            document.body.removeChild(confirmPopup);
        }
    });
}

// Update navigation based on auth state
function updateNavigation() {
    const loginLink = document.querySelector('.login-link');
    if (!loginLink) return;

    if (isLoggedIn()) {
        const user = getCurrentUser();
        loginLink.innerHTML = `
            <a href="#" onclick="logout(event)" class="user-menu">
                <i class="fas fa-user"></i> ${user.username || user.email.split('@')[0]}
            </a>
        `;
    } else {
        loginLink.innerHTML = '<i class="fas fa-user"></i> Login';
        loginLink.href = 'login.html';
    }
}

// Check protected routes
function checkAuth() {
    const protectedPages = ['favorites.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        sessionStorage.setItem('redirectUrl', currentPage);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize auth state
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    checkAuth();
}); 