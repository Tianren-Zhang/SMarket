var express = require('express');
const {connectDB, createRoles} = require('./config/mongoDB');
const chatGPTRoutes = require('./routes/chatGPTRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

connectDB();
createRoles().then(() => {
    console.log('Roles created successfully');
}).catch((err) => {
    console.error('Error creating roles:', err);
});
app.use(express.json());

// GPTChat
app.use('/chat', chatGPTRoutes);

// Auth
app.use('/auth', authRoutes);

// User
app.use('/user', userRoutes);

module.exports = app;
