const Store = require('../models/Store');
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");

const validateStoreAndOwner = async (storeId, userId) => {
    const store = await Store.findById(storeId);
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId);
    }
    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('User does not have permission', 'user', userId);
    }
    return store;
}

module.exports = {
    validateStoreAndOwner,
}