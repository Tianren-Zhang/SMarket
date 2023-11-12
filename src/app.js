var express = require('express');
const connectDB = require('./config/mongoDB');
const chatGPTRoutes = require('./routes/chatGPTRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

connectDB();
app.use(express.json());

// GPTChat
app.use('/chat', chatGPTRoutes);

// Auth
app.use('/auth', authRoutes);

// User
app.use('/user', userRoutes);

module.exports = app;
