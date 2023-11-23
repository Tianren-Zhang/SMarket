const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkProfileExists = require('../middlewares/checkProfileExists');
const {body} = require('express-validator');

const router = express.Router();

const profileValidationRules = [
    body('firstName').optional().trim().isLength({min: 2}).withMessage('First name must be at least 2 characters long'),
    body('lastName').optional().trim().isLength({min: 2}).withMessage('Last name must be at least 2 characters long'),
    body('phoneNumber').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
    body('profilePicture').optional().trim().isURL().withMessage('Invalid URL for profile picture'),
];

// @route   POST api/profile/
// @desc    Create a user profile
// @access  Private
router.post('/',
    authMiddleware,
    profileValidationRules,
    profileController.createProfile);

// @route   GET api/profile/me
// @desc    Get a user profile
// @access  Private
router.get('/me',
    authMiddleware,
    checkProfileExists,
    profileController.getCurrentProfile);

// @route   PUT api/profile/
// @desc    Update a user profile
// @access  Private
router.put('/',
    authMiddleware,
    profileValidationRules,
    checkProfileExists,
    profileController.updateProfile);

// @route   DELETE api/profile/
// @desc    Delete a user profile
// @access  Private
router.delete('/',
    authMiddleware,
    checkProfileExists,
    profileController.deleteProfile);

module.exports = router;
