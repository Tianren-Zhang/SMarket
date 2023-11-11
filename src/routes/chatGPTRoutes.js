const express = require('express');
const chatGPTController = require('../controllers/chatGPTController');
const router = express.Router();

router.post('/', chatGPTController.getChatResponse);

module.exports = router;
