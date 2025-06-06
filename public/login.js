document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const usernameOrEmail = document.getElementById('usernameOrEmail');
    const password = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupOkButton = document.getElementById('popupOkButton');
    
    // Check if user is already logged in
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Check for "remember me" and restore email/username if present
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        usernameOrEmail.value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate inputs
        let isValid = validateForm();
        if (!isValid) return;
        
        // Disable login button and show loading state
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        try {
            // For demo purposes - replace with your actual authentication
            if (usernameOrEmail.value === 'test' && password.value === 'test123') {
                // Set authentication state
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    username: 'test',
                    email: 'test@example.com'
                }));
                
                // Handle remember me
                const rememberMe = document.getElementById('rememberMe').checked;
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', usernameOrEmail.value);
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                showPopupMessage('Login successful! Redirecting...', false);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                throw new Error('Invalid username or password');
            }
        } catch (error) {
            showPopupMessage(error.message || 'Login failed. Please try again.', true);
            password.value = '';
        } finally {
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }
    });
    
    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = password.type === 'password' ? 'text' : 'password';
        password.type = type;
        togglePassword.querySelector('i').className = `fas fa-eye${type === 'password' ? '' : '-slash'}`;
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        if (!usernameOrEmail.value.trim()) {
            showError('usernameOrEmailError', 'Username or email is required');
            isValid = false;
        }
        
        if (!password.value) {
            showError('passwordError', 'Password is required');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add shake animation
        const input = document.querySelector(`#${elementId.replace('Error', '')}`);
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }
    
    // Clear all error messages
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }
    
    // Show popup message
    function showPopupMessage(message, isError = false) {
        popupMessage.textContent = message;
        popupMessage.className = isError ? 'error-message' : 'success-message';
        popupOkButton.style.display = 'block';
        popup.style.display = 'flex';
    }
    
    // Handle popup OK button
    popupOkButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
    
    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Handle Enter key in password field
    password.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginButton.click();
        }
    });
}); 