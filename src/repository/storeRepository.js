const Store = require('../models/Store');
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");

const getAllStores = async () => {
    return Store.find().populate('owner', ['username', 'email']);
};

const findStoreById = async (storeId) => {
    return Store.findById(storeId).populate('owner', ['username', 'email']);
};

const addToInventory = async (storeId, item, existingStore = null) => {
    const store = existingStore ? existingStore : await this.findStoreById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
    }
    store.inventory.push(item);
    await store.save();
    return store;
};

const removeFromInventory = async (storeId, itemId) => {
    await Store.findByIdAndUpdate(storeId, {$pull: {inventory: itemId}});
};

module.exports = {
    getAllStores,
    findStoreById,
    addToInventory,
    removeFromInventory,
};