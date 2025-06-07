document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = this.username.value.trim();
    const email = this.email.value.trim();
    const password = this.password.value.trim();
    const confirmPassword = this.confirmPassword.value.trim();

    if (!username) {
        alert('Please enter a username.');
        this.username.focus();
        return;
    }

    if (!email) {
        alert('Please enter your email.');
        this.email.focus();
        return;
    }

    if (!password) {
        alert('Please enter a password.');
        this.password.focus();
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        this.confirmPassword.focus();
        return;
    }

    // TODO: Implement actual signup logic here (e.g., API call)
    alert('Signup submitted for username: ' + username);
});
