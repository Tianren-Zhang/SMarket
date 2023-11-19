const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new profile
router.post('/', authMiddleware, profileController.createProfile);

// Get the current user's profile
router.get('/me', authMiddleware, profileController.getCurrentProfile);

// Update the current user's profile
router.put('/', authMiddleware, profileController.updateProfile);

// Delete the current user's profile
router.delete('/', authMiddleware, profileController.deleteProfile);

module.exports = router;
