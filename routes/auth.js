const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Input validation middleware
const validateSignupInput = (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = {};

    // Username validation
    if (!username || username.length < 3) {
        errors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username = 'Username can only contain letters, numbers and underscores';
    }

    // Email validation
    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.email = 'Please provide a valid email address';
    }

    // Password validation
    if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Signup route
router.post('/signup', validateSignupInput, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                errors: {
                    user: 'Username or email already exists'
                }
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        // Update last login
        await user.updateLastLogin();

        res.status(201).json({
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            errors: {
                server: 'Error creating user. Please try again later.'
            }
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                errors: {
                    auth: 'Please provide both identifier and password'
                }
            });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier }
            ]
        }).select('+password'); // Explicitly include password field

        if (!user || !user.isActive) {
            return res.status(401).json({
                errors: {
                    auth: 'Invalid credentials'
                }
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                errors: {
                    auth: 'Invalid credentials'
                }
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        // Update last login
        await user.updateLastLogin();

        res.json({
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            errors: {
                server: 'Error logging in. Please try again later.'
            }
        });
    }
});

// Get current user route
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                errors: {
                    auth: 'No token provided'
                }
            });
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({
                errors: {
                    auth: 'Invalid token'
                }
            });
        }

        res.json({ user: user.toJSON() });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            errors: {
                auth: 'Invalid token'
            }
        });
    }
});

module.exports = router; 