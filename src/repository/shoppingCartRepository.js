const ShoppingCart = require('../models/ShoppingCart');

const getCartByUserId = async (userId) => {
    const cart = await ShoppingCart.findOne({user: userId}).populate('items.item');

    return cart;
};

const addItemToCart = async (userId, itemId, quantity) => {
    const cart = await getCartByUserId(userId);

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

const updateCartItem = async (cart, itemId, quantity) => {

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

const removeItemFromCart = async (cart, itemId) => {
    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.item.toString() !== itemId);
    await cart.save();
    return cart;
};

module.exports = {
    getCartByUserId,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
}