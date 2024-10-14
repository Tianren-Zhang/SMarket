const express = require('express');
const shoppingCartController = require('../controllers/shoppingCartController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming auth middleware
const checkCustomerRole = require('../middlewares/checkCustomerRole');
const validateAll = require('../middlewares/validate');
const { param } = require('express-validator');
const router = express.Router();

// **********************  Private APIs  **************************** //

// @route   POST api/cart/
// @desc    Add item to cart
// @access  Private
router.post(
  '/',
  authMiddleware,
  checkCustomerRole,
  validateAll,
  shoppingCartController.addItemToCart
);

// @route   GET api/cart/
// @desc    Get user's cart's information
// @access  Private
router.get(
  '/',
  authMiddleware,
  checkCustomerRole,
  validateAll,
  shoppingCartController.getUserCart
);

// @route   PUT api/cart/:itemId
// @desc    Update item in user's cart
// @access  Private
router.put(
  '/:itemId',
  authMiddleware,
  checkCustomerRole,
  param('itemId').isMongoId().withMessage('Invalid store ID.'),
  validateAll,
  shoppingCartController.updateCartItem
);

// @route   DELETE api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete(
  '/:itemId',
  authMiddleware,
  checkCustomerRole,
  param('itemId').isMongoId().withMessage('Invalid store ID.'),
  validateAll,
  shoppingCartController.removeItemFromCart
);

module.exports = router;
