const express = require('express');
const router = express.Router();
// const chatGPTRoutes = require('./routes/chatGPTRoutes');
const userRoutes = require('../user/routes/userRoutes');
const authRoutes = require('../auth/routes/authRoutes');
const profileRoutes = require('../profile/routes/profileRoutes');
const storeRoutes = require('../store/routes/storeRoutes');
const itemRoutes = require('../item/routes/itemRoutes');
const shoppingCartRoutes = require('../shoppingCart/routes/shoppingCartRoutes');
const orderRoutes = require('../order/routes/orderRoutes');

const apiVersion = '/api/v1';

// GPTChat routes
// router.use('/api/chat', chatGPTRoutes);

// Auth routes
router.use(`${apiVersion}/auth`, authRoutes);

// User routes
router.use(`${apiVersion}/user`, userRoutes);

// Profile routes
router.use(`${apiVersion}/profile`, profileRoutes);

// Store routes
router.use(`${apiVersion}/store`, storeRoutes);

// Item routes
router.use(`${apiVersion}/items`, itemRoutes);

// Cart routes
router.use(`${apiVersion}/cart`, shoppingCartRoutes);

// Order routes
router.use(`${apiVersion}/order`, orderRoutes);

module.exports = router;
