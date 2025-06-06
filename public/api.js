// API utility functions
const api = {
    // Base API configuration
    baseURL: window.location.origin,
    headers: {
        'Content-Type': 'application/json'
    },

    // Generic API call function
    async call(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: this.headers,
                credentials: 'include'
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'API call failed');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Authentication endpoints
    auth: {
        async login(username, password) {
            return api.call('/api/auth/login', 'POST', { username, password });
        },
        async signup(username, password) {
            return api.call('/api/auth/signup', 'POST', { username, password });
        },
        async logout() {
            return api.call('/api/auth/logout', 'POST');
        },
        async checkSession() {
            return api.call('/api/me');
        }
    },

    // Favorites endpoints
    favorites: {
        async getFavorites() {
            return api.call('/api/favorites');
        },
        async addFavorite(characterId) {
            return api.call('/api/favorites/add', 'POST', { characterId });
        },
        async removeFavorite(characterId) {
            return api.call('/api/favorites/remove', 'POST', { characterId });
        }
    }
}; 