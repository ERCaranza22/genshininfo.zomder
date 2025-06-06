document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    // Handle password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Show notification
    function showNotification(message, type = 'error') {
        notificationMessage.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Show/hide loading overlay
    function toggleLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // Clear form errors
    function clearErrors() {
        document.getElementById('usernameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('confirmPasswordError').textContent = '';
    }

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        let isValid = true;

        if (!username || username.length < 3) {
            document.getElementById('usernameError').textContent = 'Username must be at least 3 characters long';
            isValid = false;
        }

        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        if (!password || password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long';
            isValid = false;
        }

        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            isValid = false;
        }

        if (!isValid) return;

        try {
            toggleLoading(true);

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Account created successfully! Redirecting to login...', 'success');
                
                // Get return URL from query parameters
                const params = new URLSearchParams(window.location.search);
                const returnUrl = params.get('returnUrl');
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = `login.html${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
                }, 1500);
            } else {
                if (data.errors) {
                    data.errors.forEach(error => {
                        const field = error.param;
                        const message = error.msg;
                        document.getElementById(`${field}Error`).textContent = message;
                    });
                } else {
                    showNotification(data.message || 'Sign up failed');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            showNotification('An error occurred. Please try again later.');
        } finally {
            toggleLoading(false);
        }
    });
}); 