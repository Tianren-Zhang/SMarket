const shoppingCartService = require('../services/shoppingCartService');
const { validationResult } = require('express-validator');

// Add an item to the shopping cart
exports.addItemToCart = async (req, res, next) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await shoppingCartService.addItemToCart(
      itemId,
      userId,
      quantity
    );
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

// Retrieve the current user's shopping cart
exports.getUserCart = async (req, res, next) => {
  try {
    const cart = await shoppingCartService.getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

// Update the quantity of an item in the cart
exports.updateCartItem = async (req, res, next) => {
  const userId = req.user.id;
  const { quantity } = req.body;
  const itemId = req.params.itemId;

  try {
    const cart = await shoppingCartService.updateCartItem(
      itemId,
      userId,
      quantity
    );
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

// Remove an item from the cart
exports.removeItemFromCart = async (req, res, next) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  try {
    const cart = await shoppingCartService.removeItemFromCart(itemId, userId);
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};
