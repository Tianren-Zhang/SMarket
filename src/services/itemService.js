const Item = require("../models/Item");
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
const StoreCategory = require("../models/StoreCategory");
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
    if (itemData.storeCategory) {
        const storeCategory = await StoreCategory.findOne({storeCategory: itemData.storeCategory, isDeleted: false});
        if (!storeCategory) {
            throw new NotFoundError('Store Category not found');
        }
        if (storeCategory.store.toString() !== storeId) {
            throw new UnauthorizedError('Unauthorized User');
        }
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

    if (updateData.storeCategory) {
        const storeCategory = await StoreCategory.findOne({storeCategory: updateData.storeCategory, isDeleted: false});
        if (!storeCategory) {
            throw new NotFoundError('Store Category not found');
        }
        if (storeCategory.store.toString() !== item.store.toString()) {
            throw new UnauthorizedError('Unauthorized User');
        }
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
    const items = await Item.find().populate('store', 'storeName');//.populate('category', 'name');
    // items.forEach(item => {
    //     console.log(item.images);  // Log the images array
    // });
    return items;
}

const searchByQuery = async (query) => {
    const matchQuery = {};
    const sortQuery = {};
    const limit = parseInt(query.limit);
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * limit;

    if (query.categoryId) {
        matchQuery.category = query.categoryId;
    }

    if (query.keyword) {
        matchQuery.$text = {$search: query.keyword, $caseSensitive: false};
    }

    if (query.minPrice && query.maxPrice) {
        matchQuery.price = {
            $gte: parseFloat(query.minPrice),
            $lte: parseFloat(query.maxPrice)
        };
    }

    if (query.minRating) {
        matchQuery['ratings.average'] = {$gte: parseFloat(query.minRating)};
    }

    // Add more dynamic filtering logic here if necessary

    if (query.sortBy) {
        const parts = query.sortBy.split(':');
        sortQuery[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const items = await Item.find(matchQuery)
        .populate('category', 'name') // example of populating category
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

    const totalItems = await Item.countDocuments(matchQuery);

    return {items, totalItems, page, limit};
}

module.exports = {
    deleteItemFromInventory,
    addItemToInventory,
    updateItemInInventory,
    getItemById,
    getItems,
    searchByQuery,
}