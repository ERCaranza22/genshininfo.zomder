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
        if (popupOkButton.textContent === 'Proceed') {
            window.location.href = 'index.html';
        } else {
            popup.classList.remove('show');
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
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usernameOrEmail, password })
        })
        .then(response => {
            if (response.ok) {
                popupOkButton.textContent = 'Proceed';
                showPopup('Login successful!', true);
                this.reset();
            } else if (response.status === 401) {
                popupOkButton.textContent = 'OK';
                showPopup('Invalid username/email or password.');
            } else {
                popupOkButton.textContent = 'OK';
                showPopup('Login failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            popupOkButton.textContent = 'OK';
            showPopup('Login failed. Please try again.');
        });
    }
});
