const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const validateAll = require('../middlewares/validate');

const router = express.Router();

const userValidationRules = [
  body('username', 'Username is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters long').isLength({
    min: 6,
  }),
];

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  userValidationRules,
  validateAll,
  userController.register
);

module.exports = router;
