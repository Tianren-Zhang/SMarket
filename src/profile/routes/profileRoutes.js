const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkProfileExists = require('../../middlewares/checkProfileExists');
const validateAddress = require('../../middlewares/validateAddress');
const validateAll = require('../../middlewares/validate');
const { body } = require('express-validator');

const router = express.Router();

const profileValidationRules = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  body('phoneNumber')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  body('profilePicture')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid URL for profile picture'),
];

// **********************  Private APIs  **************************** //

// @route   POST api/profile/
// @desc    Create a user profile
// @access  Private
router.post(
  '/',
  authMiddleware,
  profileValidationRules,
  validateAll,
  profileController.createProfile
);

// @route   GET api/profile/me
// @desc    Get a user profile
// @access  Private
router.get(
  '/me',
  authMiddleware,
  checkProfileExists,
  validateAll,
  profileController.getCurrentProfile
);

// @route   PUT api/profile/
// @desc    Update a user profile
// @access  Private
router.put(
  '/',
  authMiddleware,
  profileValidationRules,
  checkProfileExists,
  validateAll,
  profileController.updateProfile
);

// @route   POST api/profile/address
// @desc    Add a user address
// @access  Private
router.post(
  '/address',
  authMiddleware,
  checkProfileExists,
  validateAddress(),
  validateAll,
  profileController.addAddress
);

// @route   PUT api/profile/address/:addressId
// @desc    Update a user address
// @access  Private
router.put(
  '/address/:addressId',
  authMiddleware,
  checkProfileExists,
  validateAddress(true),
  validateAll,
  profileController.updateAddress
);

// @route   DELETE api/profile/
// @desc    Delete an address
// @access  Private
router.delete(
  '/address/:addressId',
  authMiddleware,
  checkProfileExists,
  validateAll,
  profileController.deleteAddress
);

// @route   DELETE api/profile/
// @desc    Delete a user profile
// @access  Private
router.delete(
  '/',
  authMiddleware,
  checkProfileExists,
  validateAll,
  profileController.deleteProfile
);

module.exports = router;
