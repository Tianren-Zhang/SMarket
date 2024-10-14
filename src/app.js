var express = require('express');
const mongoDB = require('./config/mongoDB');
// const chatGPTRoutes = require('./routes/chatGPTRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const storeRoutes = require('./routes/storeRoutes');
const itemRoutes = require('./routes/itemRoutes');
const shoppingCartRoutes = require('./routes/shoppingCartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./exceptions/error-handler');
const app = express();

mongoDB.connectDB();
mongoDB.createUserRoles();
mongoDB.createCategories();
mongoDB.initializeSubcategories();
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send(`API Running!`));

// GPTChat routes
// app.use('/api/chat', chatGPTRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/user', userRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Store routes
app.use('/api/store', storeRoutes);

// Item routes
app.use('/api/items', itemRoutes);

// Cart routes
app.use('/api/cart', shoppingCartRoutes);

// Order routes
app.use('/api/order', orderRoutes);

// Global Error handler
app.use(errorHandler);

module.exports = app;
