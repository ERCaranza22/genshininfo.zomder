// Auth module for handling authentication
const auth = {
    // Check if user is authenticated
    isAuthenticated() {
        return fetch('/api/auth/check', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => !!data.authenticated)
        .catch(() => false);
    },

    // Login function
    async login(formData) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    usernameOrEmail: formData.usernameOrEmail,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store minimal user data in localStorage for UI purposes
            localStorage.setItem('currentUser', JSON.stringify({
                username: data.user.username,
                email: data.user.email
            }));

            if (formData.rememberMe) {
                localStorage.setItem('rememberedUser', formData.usernameOrEmail);
            }

            return true;
        } catch (error) {
            throw error;
        }
    },

    // Logout function
    async logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Clear local storage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberedUser');
            
            // Redirect to login page
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Register function
    async register(userData) {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            return true;
        } catch (error) {
            throw error;
        }
    },

    // Update UI based on authentication status
    async updateUI() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const loginLink = document.querySelector('a[href="login.html"]');
            
            if (!loginLink) return;

            if (currentUser) {
                loginLink.textContent = currentUser.username;
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to log out?')) {
                        this.logout();
                    }
                };
            } else {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
                loginLink.onclick = null;
            }
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    },

    // Helper function to hash password (simple hash for demo)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },

    // Helper function to validate password strength
    isPasswordStrong(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    },

    // Helper function to update user data
    updateUserData(username, updates) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('users', JSON.stringify(users));
        }
    },

    // Get current user's data
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        return JSON.parse(localStorage.getItem('currentUser'));
    },

    // Update user's favorites
    updateFavorites(username, favorites) {
        this.updateUserData(username, { favorites });
    }
};

// Initialize auth state
document.addEventListener('DOMContentLoaded', () => {
    auth.updateUI();
});

// For testing: Create a test user if none exists
document.addEventListener('DOMContentLoaded', () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        // Create a test user
        const testUser = {
            username: 'test',
            email: 'test@example.com',
            password: 'Test123' // Will be hashed during registration
        };
        auth.register(testUser).catch(console.error);
    }
}); 