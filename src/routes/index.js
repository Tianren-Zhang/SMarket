const express = require('express');
const router = express.Router();
// const chatGPTRoutes = require('./routes/chatGPTRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const storeRoutes = require('./storeRoutes');
const itemRoutes = require('./itemRoutes');
const shoppingCartRoutes = require('./shoppingCartRoutes');
const orderRoutes = require('./orderRoutes');

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
