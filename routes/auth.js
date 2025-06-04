const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../model/user');
const checkDatabaseConnection = require('../middleware/database');
const { isAuthenticated } = require('../middleware/auth');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later'
});

// Apply database check and rate limiting to all auth routes
router.use(checkDatabaseConnection);
router.use(authLimiter);

// Signup endpoint
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check for existing username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const newUser = new User({ username, email, password, favorites: [] });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ 
                message: 'Missing required fields', 
                error: 'Please provide both username/email and password' 
            });
        }

        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }).select('+password'); // Explicitly include password field for comparison

        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials', 
                error: 'Invalid username/email or password' 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid credentials', 
                error: 'Invalid username/email or password' 
            });
        }

        // Set user session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.status(200).json({ 
            message: 'Login successful', 
            user: { username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: 'An unexpected error occurred during login' 
        });
    }
});

// Add logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Check session status and return user data including favorites
router.get('/session', async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const user = await User.findById(req.session.user.id);
            if (user) {
                res.status(200).json({ 
                    authenticated: true, 
                    user: {
                        username: user.username,
                        email: user.email,
                        favorites: user.favorites
                    }
                });
            } else {
                req.session.destroy();
                res.status(200).json({ authenticated: false });
            }
        } catch (err) {
            console.error('Session check error:', err);
            res.status(500).json({ message: 'Error checking session' });
        }
    } else {
        res.status(200).json({ authenticated: false });
    }
});

// Following-related endpoints
router.get('/following', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).populate('following', 'username');
        res.json({ following: user.following });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching following list', error: err.message });
    }
});

router.post('/follow/:userId', isAuthenticated, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.userId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findById(req.session.user.id);
        if (user.following.includes(req.params.userId)) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        user.following.push(req.params.userId);
        await user.save();

        res.json({ success: true, message: 'Successfully followed user' });
    } catch (err) {
        res.status(500).json({ message: 'Error following user', error: err.message });
    }
});

router.post('/unfollow/:userId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        const followingIndex = user.following.indexOf(req.params.userId);
        
        if (followingIndex === -1) {
            return res.status(400).json({ message: 'Not following this user' });
        }

        user.following.splice(followingIndex, 1);
        await user.save();

        res.json({ success: true, message: 'Successfully unfollowed user' });
    } catch (err) {
        res.status(500).json({ message: 'Error unfollowing user', error: err.message });
    }
});

// Get user's favorites
router.get('/favorites', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

// Add favorite
router.post('/favorites/add', isAuthenticated, async (req, res) => {
    const { character } = req.body;
    if (!character) {
        return res.status(400).json({ message: 'Character name required' });
    }

    try {
        const user = await User.findById(req.session.user.id);
        if (user.favorites.includes(character)) {
            return res.status(400).json({ message: 'Character already in favorites' });
        }

        user.favorites.push(character);
        await user.save();
        res.json({ message: 'Character added to favorites', favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Error adding favorite' });
    }
});

// Remove favorite
router.post('/favorites/remove', isAuthenticated, async (req, res) => {
    const { character } = req.body;
    if (!character) {
        return res.status(400).json({ message: 'Character name required' });
    }

    try {
        const user = await User.findById(req.session.user.id);
        const index = user.favorites.indexOf(character);
        if (index === -1) {
            return res.status(400).json({ message: 'Character not in favorites' });
        }

        user.favorites.splice(index, 1);
        await user.save();
        res.json({ message: 'Character removed from favorites', favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Error removing favorite' });
    }
});

module.exports = router;
