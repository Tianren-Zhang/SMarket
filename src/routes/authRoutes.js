const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const router = express.Router();


router.post('/login', [
        // Validation
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists()
    ],
    authController.loginUser);
router.get('/login', authMiddleware, authController.getInfo);


module.exports = router;
