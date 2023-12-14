const Item = require("../models/Item");
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
const StoreCategory = require("../models/StoreCategory");
const Store = require("../models/Store");

const getItems = async () => {
    const items = await Item.find().populate('store', 'storeName');//.populate('category', 'name');
    // items.forEach(item => {
    //     console.log(item.images);  // Log the images array
    // });
    return items;
}

const getItemById = async (itemId) => {
    const item = await Item.findById(itemId).populate('store', 'storeName').populate('category', 'name').select('-isDeleted');
    if (!item) {
        throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
    }
    return item;
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

const addItemToInventory = async (storeId, userId, itemData) => {
    const store = await Store.findById(storeId);
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
    }

    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('User does not have permission to update this item', 'user', userId, 'header');
    }
    if (itemData.storeCategory) {
        const storeCategory = await StoreCategory.findOne({storeCategory: itemData.storeCategory, isDeleted: false});
        if (!storeCategory) {
            throw new NotFoundError('Store Category not found', 'storeCategory', storeCategory, 'body');
        }
        if (storeCategory.store.toString() !== storeId) {
            throw new UnauthorizedError('Unauthorized User', 'user', userId, 'header');
        }
    }
    const newItem = new Item({store: storeId, ...itemData});
    await newItem.save();

    store.inventory.push(newItem);
    await store.save();
    // console.log(store.inventory);
    const itemResponse = newItem.toObject();
    delete itemResponse.isDeleted;
    return itemResponse;
};

const updateItemInInventory = async (userId, itemId, updateData) => {
    const item = await checkItem(userId, itemId);

    if (updateData.storeCategory) {
        const storeCategory = await StoreCategory.findById(updateData.storeCategory);
        if (!storeCategory || storeCategory.isDeleted) {
            throw new NotFoundError('Store Category not found', 'storeCategory', storeCategory, 'body');
        }
        // console.log(storeCategory.store);
        // console.log(item.store);
        if (storeCategory.store.toString() !== item.store._id.toString()) {
            throw new UnauthorizedError('Unauthorized User', 'user', userId, 'header');
        }
    }

    // Perform the update
    const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, {new: true}).select('-isDeleted');
    return updatedItem;
};

const deleteItemFromInventory = async (userId, itemId) => {
    const item = await checkItem(userId, itemId);

    await Store.findByIdAndUpdate(item.store, {$pull: {inventory: itemId}});
    // Remove the item
    item.isDeleted = true;
    await item.save();
};


async function checkItem(userId, itemId) {
    const item = await Item.findById(itemId).populate('store');

    if (!item) {
        throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
    }

    // Check if the user owns the store
    if (item.store.owner.toString() !== userId || item.store.isDeleted) {
        throw new UnauthorizedError('User does not have permission to update this item');
    }
    return item;
}

module.exports = {
    deleteItemFromInventory,
    addItemToInventory,
    updateItemInInventory,
    getItemById,
    getItems,
    searchByQuery,
}