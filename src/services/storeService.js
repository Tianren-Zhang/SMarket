const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const Store = require('../models/Store');
const Item = require('../models/Item');
const User = require("../models/User");

const createStore = async (ownerId, storeData) => {
    const owner = await User.findById(ownerId).populate('userRole');

    const store = new Store({owner: ownerId, ...storeData});
    await store.save();

    owner.store.push(store._id);
    await owner.save();
    return store;
};

const updateStore = async (storeId, userId, updateData) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found');
    }

    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized User');
    }

    return Store.findOneAndUpdate(
        {owner: store.owner},
        {$set: updateData},
        {new: true, upsert: true}
    ).populate('owner', ['username', 'email']);
};

const addItemToInventory = async (storeId, userId, itemData) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found');
    }

    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized User');
    }

    const newItem = new Item({store: storeId, ...itemData});
    await newItem.save();

    store.inventory.push(newItem);
    await store.save();
    // console.log(store.inventory);
    return newItem;
};

const updateItemInInventory = async (userId, itemId, updateData) => {
    // Find the item along with its associated store
    const item = await Item.findById(itemId).populate('store');

    if (!item) {
        throw new NotFoundError('Item not found');
    }

    // Check if the user owns the store
    if (item.store.owner.toString() !== userId) {
        throw new UnauthorizedError('User does not have permission to update this item');
    }

    // Perform the update
    const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, {new: true});
    return updatedItem;
};


const getStoreInfo = async (storeId) => {
    const store = await Store.findById(storeId)
        .populate('inventory.item')
        .populate('owner', ['username', 'email']);
    if (!store) {
        throw new NotFoundError('Store not found');
    }
    return store;
};


const deleteStore = async (storeId, userId) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found');
    }
    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized User');
    }

    // console.log(store.owner);
    await Item.deleteMany({store: storeId});
    await Store.findByIdAndDelete(storeId);
    await User.findByIdAndUpdate(store.owner, {$pull: {store: storeId}});
};

const deleteItemFromInventory = async (itemId, userId) => {
    const item = await Item.findById(itemId).populate('store');
    if (!item) {
        throw new NotFoundError('Item not found');
    }
    if (item.store.owner.toString() !== userId) {
        throw new UnauthorizedError('User does not have permission to update this item');
    }

    await Store.findByIdAndUpdate(item.owner, {$pull: {inventory: itemId}});
    // Remove the item
    await Item.findByIdAndDelete(itemId);

};

module.exports = {
    createStore,
    updateStore,
    addItemToInventory,
    updateItemInInventory,
    getStoreInfo,
    deleteStore,
    deleteItemFromInventory
};
