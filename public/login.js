document.addEventListener('DOMContentLoaded', function() {
    // Check if we were redirected from signup
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'signup') {
        showPopup('Sign up successful! Please log in.', false);
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous errors
    document.getElementById('usernameOrEmailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    let valid = true;

    const usernameOrEmail = this.usernameOrEmail.value.trim();
    const password = this.password.value;

    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupOkButton = document.getElementById('popupOkButton');

    function showPopup(message, showOkButton = false) {
        popupMessage.textContent = message;
        if (showOkButton) {
            popupOkButton.style.display = 'inline-block';
        } else {
            popupOkButton.style.display = 'none';
        }
        popup.classList.add('show');
        if (!showOkButton) {
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        }
    }

    popupOkButton.onclick = function() {
        popup.classList.remove('show');
        if (popupOkButton.dataset.action === 'redirect') {
            // Get return URL from query parameters
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');
            if (returnUrl && !returnUrl.includes('/signup') && !returnUrl.includes('/login')) {
                window.location.href = decodeURIComponent(returnUrl);
            } else {
                window.location.href = '/';
            }
        }
    };

    // Validation
    if (usernameOrEmail.length === 0) {
        document.getElementById('usernameOrEmailError').textContent = 'Please enter your username or email.';
        valid = false;
    }

    if (password.length === 0) {
        document.getElementById('passwordError').textContent = 'Please enter your password.';
        valid = false;
    }

    if (valid) {
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        // Send login request to the API
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                usernameOrEmail: usernameOrEmail,
                password: password 
            }),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return response.json().then(data => {
                        throw new Error('Invalid username/email or password');
                    });
                }
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Login successful') {
                // Show success popup with redirect
                popupOkButton.textContent = 'Continue';
                popupOkButton.dataset.action = 'redirect';
                showPopup('Login successful!', true);
                
                // Reset form
                this.reset();
            } else {
                throw new Error(data.message || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            
            if (error.message === 'Invalid username/email or password') {
                document.getElementById('usernameOrEmailError').textContent = 'Invalid username/email or password';
                document.getElementById('passwordError').textContent = 'Invalid username/email or password';
            } else {
                showPopup(error.message || 'An error occurred during login. Please try again.');
            }
        })
        .finally(() => {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    }
});
