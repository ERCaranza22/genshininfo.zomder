document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const togglePasswordButton = document.getElementById('togglePassword');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupOkButton = document.getElementById('popupOkButton');

    // Check if user is already logged in
    api.auth.checkSession()
        .then(response => {
            if (response.user) {
                window.location.href = '/index.html';
            }
        })
        .catch(error => console.error('Session check failed:', error));

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePasswordButton.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form values
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validate inputs
        let isValid = true;
        
        if (!username) {
            showError('usernameError', 'Username is required');
            isValid = false;
        }
        
        if (!password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Disable login button
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        
        try {
            // Attempt login
            const response = await api.auth.login(username, password);
            
            // Show success message
            showPopup('Login successful! Redirecting...', true);
            
            // Store session if remember me is checked
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);
            
        } catch (error) {
            // Show error message
            showPopup(error.message || 'Login failed. Please try again.', false);
            
            // Re-enable login button
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });

    // Helper functions
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function showPopup(message, isSuccess = true) {
        popupMessage.textContent = message;
        popupMessage.className = isSuccess ? 'success' : 'error';
        popup.style.display = 'flex';
        
        if (!isSuccess) {
            popupOkButton.style.display = 'block';
            popupOkButton.onclick = () => {
                popup.style.display = 'none';
            };
        } else {
            popupOkButton.style.display = 'none';
        }
    }
}); 