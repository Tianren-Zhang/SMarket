const Item = require("../models/Item");
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
const Store = require("../models/Store");

const deleteItemFromInventory = async (itemId, userId) => {
    const item = await Item.findById(itemId).populate('store');
    if (!item) {
        throw new NotFoundError('Item not found');
    }
    if (item.store.owner.toString() !== userId) {
        throw new UnauthorizedError('User does not have permission to update this item');
    }

    await Store.findByIdAndUpdate(item.store, {$pull: {inventory: itemId}});
    // Remove the item
    await Item.findByIdAndDelete(itemId);

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

const getItemById = async (itemId) => {
    const item = await Item.findById(itemId).populate('store', 'storeName').populate('category', 'name');
    if (!item) {
        throw new NotFoundError('Item not found');
    }
    return item;
}

const getItems = async () => {
    return Item.find().populate('store', 'storeName').populate('category', 'name');
}

module.exports = {
    deleteItemFromInventory,
    addItemToInventory,
    updateItemInInventory,
    getItemById,
    getItems,
}