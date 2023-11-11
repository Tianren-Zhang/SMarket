var express = require('express');

// src/app.js

const chatGPTRoutes = require('./routes/chatGPTRoutes');
const app = express();

app.use(express.json());

// Use chatRoutes for the "/chat" endpoint
app.use('/chat', chatGPTRoutes);

module.exports = app;
