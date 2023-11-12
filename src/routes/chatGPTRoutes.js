const express = require('express');
const chatGPTController = require('../controllers/chatGPTController');
const router = express.Router();

router.post('/GPT3.5', chatGPTController.getChatResponse);

module.exports = router;
