const express = require('express');
const shoppingCartController = require('../controllers/shoppingCartController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming auth middleware
const checkCustomerRole = require('../middlewares/storeMiddleware/checkCustomerRole');
const router = express.Router();

// Add item to cart
router.post('/',
    authMiddleware,
    checkCustomerRole,
    shoppingCartController.addItemToCart
);

// Get user's cart
router.get('/',
    authMiddleware,
    checkCustomerRole,
    shoppingCartController.getUserCart
);

// Update item in cart
router.put('/:itemId',
    authMiddleware,
    checkCustomerRole,
    shoppingCartController.updateCartItem
);

// Remove item from cart
router.delete('/:itemId',
    authMiddleware,
    checkCustomerRole,
    shoppingCartController.removeItemFromCart
);

module.exports = router;
