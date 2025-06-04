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
    }    popupOkButton.onclick = function() {
        popup.classList.remove('show');
        if (popupOkButton.dataset.action === 'redirect') {
            // Get return URL from query parameters
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');
            if (returnUrl && !returnUrl.includes('/signup')) {
                window.location.href = decodeURIComponent(returnUrl);
            } else {
                window.location.href = '/';
            }
        }
    };

    if (usernameOrEmail.length === 0) {
        document.getElementById('usernameOrEmailError').textContent = 'Please enter your username or email.';
        valid = false;
    }

    if (password.length === 0) {
        document.getElementById('passwordError').textContent = 'Please enter your password.';
        valid = false;
    }

    if (valid) {
        // Send login request to the API
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usernameOrEmail, password })
        })
        .then(response => {
            if (!response.ok) {
                // Handle 401 (unauthorized) errors separately
                if (response.status === 401) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Invalid credentials');
                    });
                }
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Login successful') {
                // Save current logged-in user to localStorage
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                // Show success popup
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
            popupOkButton.textContent = 'OK';
            popupOkButton.dataset.action = '';
            
            // Show specific error message for 401 errors
            if (error.message === 'Invalid credentials') {
                showPopup('Invalid username/email or password');
            } else {
                showPopup(error.message || 'An error occurred during login. Please try again.');
            }
        });
    }
});
