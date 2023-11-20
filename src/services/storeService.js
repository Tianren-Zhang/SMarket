const Store = require('../models/Store');
const Item = require('../models/Item');
const User = require("../models/User/User");

const createStore = async (ownerId, storeData) => {
    const store = new Store({owner: ownerId, ...storeData});
    await store.save();

    const owner = await User.findById(ownerId);
    owner.store.push(store._id);
    await owner.save();
    return store;
};

const addItemToInventory = async (storeId, itemData) => {
    const store = await Store.findById(storeId);
    const newItem = new Item({store: storeId, ...itemData});
    await newItem.save();

    store.inventory.push(newItem);
    await store.save();
    // console.log(store.inventory);
    return newItem;
};

const updateItemInInventory = async (itemId, updateData) => {
    return Item.findByIdAndUpdate(itemId, updateData, {new: true});
};

const getStoreInfo = async (storeId) => {
    return Store.findById(storeId).populate('inventory', ['name', 'price']).populate('owner', ['username', 'email']);
};

const deleteStore = async (storeId) => {
    const store = await Store.findById(storeId);
    // console.log(store.owner);
    await Item.deleteMany({store: storeId});
    await Store.findByIdAndDelete(storeId);
    await User.findByIdAndUpdate(store.owner, {$pull: {store: storeId}});
};

const deleteItemFromInventory = async (itemId) => {
    const item = await Item.findById(itemId);
    await Store.findByIdAndUpdate(item.owner, {$pull: {inventory: itemId}});
    // Remove the item
    await Item.findByIdAndDelete(itemId);

};

module.exports = {
    createStore,
    addItemToInventory,
    updateItemInInventory,
    getStoreInfo,
    deleteStore,
    deleteItemFromInventory
};
