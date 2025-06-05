document.getElementById('signupForm').addEventListener('submit', function(event) {
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
        window.location.href = '/login';
    };

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
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Signing up...';

        // Send signup request to the API
        fetch('/api/signup', {
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
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Signup failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'User created successfully') {
                // Show success popup and redirect to login
                showPopup('Sign Up Successful! Redirecting to login...', true);
                this.reset();
            } else {
                throw new Error(data.message || 'Signup failed');
            }
        })
        .catch(error => {
            console.error('Signup error:', error);
            // Show specific error messages
            if (error.message.includes('Username already exists')) {
                document.getElementById('usernameError').textContent = 'Username is already taken.';
            } else if (error.message.includes('Email already registered')) {
                document.getElementById('emailError').textContent = 'Email is already registered.';
            } else {
                showPopup(error.message || 'An error occurred during signup. Please try again.');
            }
        })
        .finally(() => {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    }
});
