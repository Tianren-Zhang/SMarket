const express = require('express');
const chatGPTController = require('../controllers/chatGPTController');
const authMiddleware = require('../middlewares/authMiddleware');
const {body} = require('express-validator');
const router = express.Router();

const ChatGPTValidationRules = [
    body('message', 'Message is required').trim().exists()
];

// @route   POST api/chat/GPT3.5
// @desc    Type text, get response from GPT3.5
// @access  Private
router.post('/GPT3.5',
    authMiddleware,
    ChatGPTValidationRules,
    chatGPTController.getChatResponse);

module.exports = router;
