const Item = require('../../models/Item');
const ShoppingCart = require('../../models/ShoppingCart');
const itemRepository = require('../../item/repository/itemRepository');
const shoppingCartRepository = require('../repository/shoppingCartRepository');
const shoppingCartValidation = require('../validations/shoppingCartValidation');
const NotFoundError = require('../../exceptions/NotFoundError');
const User = require('../../models/User');

const addItemToCart = async (itemId, userId, quantity) => {
  const item = await itemRepository.findItemById(itemId);
  if (!item) {
    throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
  }

  return shoppingCartRepository.addItemToCart(userId, itemId, quantity);
};

// Retrieve the current user's shopping cart
const getUserCart = async (userId) => {
  const cart = await shoppingCartRepository.getCartByUserId(userId);
  if (!cart) {
    throw new NotFoundError('Cart not found', 'user', userId, 'header');
  }
  return cart;
};

// Update the quantity of an item in the cart
const updateCartItem = async (itemId, userId, quantity) => {
  const { user, item, cart } = await shoppingCartValidation.validateItem(
    userId,
    itemId
  );

  return await shoppingCartRepository.updateCartItem(cart, itemId, quantity);
};

// Remove an item from the cart
const removeItemFromCart = async (itemId, userId) => {
  const { user, item, cart } = await shoppingCartValidation.validateItem(
    userId,
    itemId
  );

  return await shoppingCartRepository.removeItemFromCart(cart, itemId);
};

module.exports = {
  addItemToCart,
  getUserCart,
  updateCartItem,
  removeItemFromCart,
};
