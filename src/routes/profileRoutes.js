const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const {body} = require('express-validator');

const router = express.Router();

const profileValidationRules = [
    body('firstName').optional().trim().isLength({min: 2}).withMessage('First name must be at least 2 characters long'),
    body('lastName').optional().trim().isLength({min: 2}).withMessage('Last name must be at least 2 characters long'),
    body('phoneNumber').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
    body('profilePicture').optional().trim().isURL().withMessage('Invalid URL for profile picture'),
];


// Create a new profile
router.post('/',
    authMiddleware,
    profileValidationRules,
    profileController.createProfile);

// Get the current user's profile
router.get('/me',
    authMiddleware,
    profileController.getCurrentProfile);

// Update the current user's profile
router.put('/',
    authMiddleware,
    profileValidationRules,
    profileController.updateProfile);

// Delete the current user's profile
router.delete('/',
    authMiddleware,
    profileController.deleteProfile);

module.exports = router;
