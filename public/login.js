document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();

    if (!email) {
        alert('Please enter your email or username.');
        this.email.focus();
        return;
    }

    if (!password) {
        alert('Please enter your password.');
        this.password.focus();
        return;
    }

    // TODO: Implement actual login logic here (e.g., API call)
    alert('Login submitted with email/username: ' + email);
});
