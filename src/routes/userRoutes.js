// src/routes/userRoutes.js

const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Registration endpoint
router.post(
    '/register',
    [
        // Validation
        body('username', 'Username is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
    ],
    userController.register
);

module.exports = router;
