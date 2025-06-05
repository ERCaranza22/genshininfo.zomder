document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupOkButton = document.getElementById('popupOkButton');
    const loadingOverlay = document.getElementById('loading-overlay');
    const signupLink = document.getElementById('signupLink');

    // Check if we were redirected from signup or have a return URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'signup') {
        showPopup('Sign up successful! Please log in.', false);
    }

    // Check if already logged in
    checkSession();

    // Handle return URL for signup link
    const returnUrl = params.get('returnUrl');
    if (returnUrl && signupLink) {
        signupLink.href = `/signup?returnUrl=${encodeURIComponent(returnUrl)}`;
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

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Clear previous errors
        document.getElementById('usernameOrEmailError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        let valid = true;
        const usernameOrEmail = this.usernameOrEmail.value.trim();
        const password = this.password.value;

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
            showLoading(true);

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        usernameOrEmail: usernameOrEmail,
                        password: password 
                    }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success message
                    showPopup('Login successful!', true);
                    
                    // Clear form
                    this.reset();

                    // Set up redirect
                    popupOkButton.onclick = function() {
                        popup.classList.remove('show');
                        const returnUrl = params.get('returnUrl');
                        window.location.href = returnUrl ? decodeURIComponent(returnUrl) : '/';
                    };

                    // Auto redirect after 2 seconds if user doesn't click OK
                    setTimeout(() => {
                        const returnUrl = params.get('returnUrl');
                        window.location.href = returnUrl ? decodeURIComponent(returnUrl) : '/';
                    }, 2000);
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                
                if (error.message === 'Invalid username/email or password') {
                    document.getElementById('usernameOrEmailError').textContent = 'Invalid username/email or password';
                    document.getElementById('passwordError').textContent = 'Invalid username/email or password';
                } else {
                    showPopup(error.message || 'An error occurred during login. Please try again.');
                }
            } finally {
                showLoading(false);
            }
        }
    });
});
