var express = require('express');
const mongoDB = require('./config/mongoDB');
const chatGPTRoutes = require('./routes/chatGPTRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const storeRoutes = require('./routes/storeRoutes');
const itemRoutes = require('./routes/itemRoutes');
const app = express();

mongoDB.connectDB();
mongoDB.createUserRoles();
mongoDB.createCategories();
mongoDB.initializeSubcategories();
app.use(express.json({extended: false}));


app.get('/', (req, res) => res.send(`API Running!`));

// GPTChat
app.use('/api/chat', chatGPTRoutes);

// Auth
app.use('/api/auth', authRoutes);

// User
app.use('/api/user', userRoutes);

//Profile
app.use('/api/profile', profileRoutes);

// Store routes
app.use('/api/store', storeRoutes);

//
app.use('/api/items', itemRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({error: message});
});

module.exports = app;
