document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupButton = document.getElementById('signupButton');
    const togglePasswordButton = document.getElementById('togglePassword');
    const toggleConfirmPasswordButton = document.getElementById('toggleConfirmPassword');
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

    toggleConfirmPasswordButton.addEventListener('click', () => {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
        toggleConfirmPasswordButton.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
    });

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form values
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        // Validate inputs
        let isValid = true;
        
        if (!username) {
            showError('usernameError', 'Username is required');
            isValid = false;
        } else if (username.length < 3) {
            showError('usernameError', 'Username must be at least 3 characters long');
            isValid = false;
        }
        
        if (!password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Disable signup button
        signupButton.disabled = true;
        signupButton.textContent = 'Creating Account...';
        
        try {
            // Attempt signup
            const response = await api.auth.signup(username, password);
            
            // Show success message
            showPopup('Account created successfully! Redirecting to login...', true);
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
            
        } catch (error) {
            // Show error message
            showPopup(error.message || 'Failed to create account. Please try again.', false);
            
            // Re-enable signup button
            signupButton.disabled = false;
            signupButton.textContent = 'Sign Up';
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