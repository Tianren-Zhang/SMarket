const Item = require("../models/Item");
const ShoppingCart = require("../models/ShoppingCart");
const NotFoundError = require("../exceptions/NotFoundError");
const User = require("../models/User");

const addItemToCart = async (itemId, userId, quantity) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
    }

    let cart = await ShoppingCart.findOne({user: userId});

    // Check if item already in cart, then just update the quantity
    const cartItemIndex = cart.items.findIndex(item => item.item.toString() === itemId);
    if (cartItemIndex > -1) {
        cart.items[cartItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        const newItem = {item: itemId, quantity};
        cart.items.push(newItem);
    }

    await cart.save();
    return cart;
};

// Retrieve the current user's shopping cart
const getUserCart = async (userId) => {
    const cart = await ShoppingCart.findOne({user: userId}).populate('items.item');
    if (!cart) {
        throw new NotFoundError('Cart not found', 'user', userId, 'header');
    }
    return cart;
};

// Update the quantity of an item in the cart
const updateCartItem = async (itemId, userId, quantity) => {
    const {user, item, cart} = await checkItem(userId, itemId);

    // Find the item and update the quantity
    const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return cart;
    } else {
        throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
    }
};

// Remove an item from the cart
const removeItemFromCart = async (itemId, userId) => {
    const {user, item, cart} = await checkItem(userId, itemId);

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.item.toString() !== itemId);
    await cart.save();
    return cart;
};

async function checkItem(userId, itemId) {
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        throw new NotFoundError('User not found', 'user', userId, 'header');
    }

    const cart = await ShoppingCart.findOne({user: userId});
    if (!cart) {
        throw new NotFoundError('Cart not found', 'user', userId, 'header');
    }

    const item = await Item.findById(itemId);
    if (!item || item.isDeleted) {
        throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
    }
    return {user, item, cart};
}

module.exports = {
    addItemToCart,
    getUserCart,
    updateCartItem,
    removeItemFromCart
}