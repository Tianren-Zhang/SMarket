const Item = require('../models/Item');

// Query
const findItemById = async (itemId) => {
    return Item.findById(itemId).populate('store', 'storeName owner').populate('category', 'name');
};

const getAllItems = async () => {
    return Item.find().populate('store', 'storeName');//.populate('category', 'name');
};

const searchByQuery = async (matchQuery, sortQuery, skip, limit) => {
    const items = await Item.find(matchQuery)
        .populate('category', 'name')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

    const totalItems = await Item.countDocuments(matchQuery);

    return {items, totalItems};
};

const createItem = async (itemData) => {
    const newItem = new Item(itemData);
    await newItem.save();
    return newItem.toObject();
};

const updateItem = async (itemId, updateData) => {
    return Item.findByIdAndUpdate(itemId, updateData, {new: true}).select('-isDeleted');
};

const deleteItem = async (itemId, existingItem = null) => {
    const item = existingItem ? existingItem : await this.findById(itemId);
    item.isDeleted = true;
    await item.save();
    return item;
};

module.exports = {
    findItemById,
    getAllItems,
    searchByQuery,
    createItem,
    updateItem,
    deleteItem,
};