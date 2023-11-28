const Item = require("../models/Item");
const ShoppingCart = require("../models/ShoppingCart");
const NotFoundError = require("../exceptions/NotFoundError");

exports.addItemToCart = async (itemId, userId, quantity) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new NotFoundError('Item not found');
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
exports.getUserCart = async (userId) => {
    const cart = await ShoppingCart.findOne({user: userId}).populate('items.item');
    if (!cart) {
        throw new NotFoundError('Cart not found');
    }
    return cart;
};

// Update the quantity of an item in the cart
exports.updateCartItem = async (itemId, userId, quantity) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new NotFoundError('Item not found   a');
    }

    const cart = await ShoppingCart.findOne({user: userId});
    if (!cart) {
        throw new NotFoundError('Cart not found');
    }

    // Find the item and update the quantity
    const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return cart;
    } else {
        throw new NotFoundError('Item not found');
    }
};

// Remove an item from the cart
exports.removeItemFromCart = async (itemId, userId) => {
    const cart = await ShoppingCart.findOne({user: userId});
    if (!cart) {
        throw new NotFoundError('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
        throw new NotFoundError('Item not found in cart');
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.item.toString() !== itemId);
    await cart.save();
    return cart;
};