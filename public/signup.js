document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupOkButton = document.getElementById('popupOkButton');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loginLink = document.getElementById('loginLink');

    // Check if already logged in
    checkSession();

    // Handle return URL for login link
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('returnUrl');
    if (returnUrl && loginLink) {
        loginLink.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    }

    async function checkSession() {
        try {
            const response = await fetch('/api/session', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.authenticated) {
                // If already logged in, redirect to appropriate page
                const returnUrl = params.get('returnUrl');
                window.location.href = returnUrl ? decodeURIComponent(returnUrl) : '/';
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    }

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

    function showLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Clear previous errors
        document.getElementById('usernameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('confirmPasswordError').textContent = '';

        let valid = true;

        const username = this.username.value.trim();
        const email = this.email.value.trim();
        const password = this.password.value;
        const confirmPassword = this.confirmPassword.value;

        // Validation
        if (username.length < 3) {
            document.getElementById('usernameError').textContent = 'Username must be at least 3 characters.';
            valid = false;
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            valid = false;
        }

        if (password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters.';
            valid = false;
        }

        if (confirmPassword !== password) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
            valid = false;
        }

        if (valid) {
            showLoading(true);

            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username: username,
                        email: email,
                        password: password 
                    }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success message
                    showPopup('Sign Up Successful! Redirecting to login...', true);
                    
                    // Clear form
                    this.reset();

                    // Set up redirect
                    popupOkButton.onclick = function() {
                        popup.classList.remove('show');
                        const returnUrl = params.get('returnUrl');
                        window.location.href = `/login?from=signup${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
                    };

                    // Auto redirect after 2 seconds if user doesn't click OK
                    setTimeout(() => {
                        const returnUrl = params.get('returnUrl');
                        window.location.href = `/login?from=signup${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
                    }, 2000);
                } else {
                    throw new Error(data.message || 'Signup failed');
                }
            } catch (error) {
                console.error('Signup error:', error);
                
                if (error.message.includes('Username already exists')) {
                    document.getElementById('usernameError').textContent = 'Username is already taken.';
                } else if (error.message.includes('Email already registered')) {
                    document.getElementById('emailError').textContent = 'Email is already registered.';
                } else {
                    showPopup(error.message || 'An error occurred during signup. Please try again.');
                }
            } finally {
                showLoading(false);
            }
        }
    });
});
