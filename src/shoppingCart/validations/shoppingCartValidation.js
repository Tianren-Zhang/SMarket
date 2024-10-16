const User = require('../../models/User');
const ShoppingCart = require('../../models/ShoppingCart');
const Item = require('../../models/Item');
const NotFoundError = require('../../exceptions/NotFoundError');

const validateItem = async (userId, itemId) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found', 'user', userId, 'header');
  }

  const cart = await ShoppingCart.findOne({ user: userId });
  if (!cart) {
    throw new NotFoundError('Cart not found', 'user', userId, 'header');
  }

  const item = await Item.findById(itemId);
  if (!item || item.isDeleted) {
    throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
  }
  return { user, item, cart };
};

module.exports = {
  validateItem,
};
