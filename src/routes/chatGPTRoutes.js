const express = require('express');
const chatGPTController = require('../controllers/chatGPTController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


// @route   POST api/chat/GPT3.5
// @desc    Type text, get response from GPT3.5
// @access  Private
router.post('/GPT3.5', authMiddleware, chatGPTController.getChatResponse);

module.exports = router;
