const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const Store = require('../models/Store');
const Item = require('../models/Item');
const User = require("../models/User");

const createStore = async (ownerId, storeData) => {
    const owner = await User.findById(ownerId);
    if (!owner) {
        throw new NotFoundError('Owner not found');
    }

    const store = new Store({owner: ownerId, ...storeData});
    await store.save();

    owner.store.push(store._id);
    await owner.save();
    return store;
};

const updateStore = async (storeId, updateData) => {
    const store = await Store.findById(storeId);
    return Store.findOneAndUpdate(
        {owner: store.owner},
        {$set: updateData},
        {new: true, upsert: true}
    ).populate('owner', ['username', 'email']);
};

const addItemToInventory = async (storeId, itemData) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found');
    }

    const newItem = new Item({store: storeId, ...itemData});
    await newItem.save();

    store.inventory.push(newItem);
    await store.save();
    // console.log(store.inventory);
    return newItem;
};

const updateItemInInventory = async (itemId, updateData) => {
    const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, {new: true});
    if (!updatedItem) {
        throw new NotFoundError('Item not found');
    }
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


const deleteStore = async (storeId) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found');
    }
    // console.log(store.owner);
    await Item.deleteMany({store: storeId});
    await Store.findByIdAndDelete(storeId);
    await User.findByIdAndUpdate(store.owner, {$pull: {store: storeId}});
};

const deleteItemFromInventory = async (itemId) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new NotFoundError('Item not found');
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
