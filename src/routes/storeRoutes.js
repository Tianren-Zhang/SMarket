const express = require('express');
const storeController = require('../controllers/storeController');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new store
router.post('/', authMiddleware, storeController.createStore);

// Route to add an item to a store's inventory
router.post('/:storeId/item', authMiddleware, storeController.addItem);

// Route to update an item in a store's inventory
router.put('/item/:itemId', authMiddleware, storeController.updateItem);

// Route to get store information
router.get('/:storeId', authMiddleware, storeController.getStore);

// Route to delete a store
router.delete('/:storeId', authMiddleware, storeController.deleteStore);

// Route to delete an item from a store's inventory
router.delete('/item/:itemId', authMiddleware, storeController.deleteItem);

module.exports = router;
