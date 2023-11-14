const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const {body} = require('express-validator');
const router = express.Router();

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
        // Validation
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists()
    ],
    authController.loginUser);

// @route   GET api/auth
// @desc    Get information of the user
// @access  Private
router.get('/', authMiddleware, authController.getInfo);


module.exports = router;
