const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let users = [];

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    // Save user (in-memory)
    users.push({ username, email, password });
    res.status(201).json({ message: 'User created successfully' });
});

app.post('/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = users.find(user =>
        (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
        user.password === password
    );

    if (user) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
