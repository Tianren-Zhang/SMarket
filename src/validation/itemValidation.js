const Item = require("../models/Item");
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
const storeRepository = require("../repository/storeRepository");
const itemRepository = require("../repository/itemRepository");


const checkItemOwnership = async (userId, itemId) => {
    const item = await itemRepository.findItemById(itemId);

    if (!item || item.isDeleted) {
        throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
    }

    // Check if the user owns the store
    if (item.store.owner.toString() !== userId || item.store.isDeleted) {
        throw new UnauthorizedError('User does not have permission to update this item');
    }
    return item;
};

const validateStoreAndOwner = async (storeId, userId) => {
    const store = await storeRepository.findStoreById(storeId);
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId);
    }
    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('User does not have permission', 'user', userId);
    }
    return store;
};

module.exports = {
    checkItemOwnership,
    validateStoreAndOwner,

};
