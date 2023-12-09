const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const StoreCategory = require('../models/StoreCategory');
const Store = require('../models/Store');
const Item = require('../models/Item');
const User = require("../models/User");

const getStores = async () => {
    return Store.find().populate('owner', ['username', 'email']);
}

const getStoreById = async (storeId) => {
    const store = await Store.findById(storeId).populate('owner', ['username', 'email']);
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found');
    }
    return store;
}

const createStore = async (ownerId, storeData) => {
    const owner = await User.findById(ownerId).populate('userRole');

    const store = new Store({owner: ownerId, ...storeData});
    await store.save();

    owner.store.push(store._id);
    await owner.save();
    return store;
};

const updateStore = async (storeId, userId, updateData) => {
    const store = valiateStoreId(userId, storeId);

    return Store.findOneAndUpdate(
        {owner: store.owner},
        {$set: updateData},
        {new: true, upsert: true}
    ).populate('owner', ['username', 'email']);
};

const getStoreInfo = async (storeId) => {
    const store = await Store.findById(storeId)
        .populate('inventory.item')
        .populate('owner', ['username', 'email']);
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found');
    }
    return store;
};


const deleteStore = async (storeId, userId) => {
    const store = valiateStoreId(userId, storeId);
    // console.log(store.owner);
    await Item.deleteMany({store: storeId});
    await Store.findByIdAndDelete(storeId);
    await User.findByIdAndUpdate(store.owner, {$pull: {store: storeId}});
};

const createStoreCategory = async (userId, storeId, storeCategoryData) => {
    const store = valiateStoreId(userId, storeId);
    const {name, parentCategory, description, images, featured, tags, customFields} = storeCategoryData;
    const newCategory = new StoreCategory({
        name,
        store: storeId,
        parentCategory,
        description,
        images,
        featured,
        tags,
        customFields
    });
    store.storeCategories.push(newCategory._id);
    await store.save();
    await newCategory.save();

    return store;
}

const updateStoreCategoryById = async (userId, storeId, categoryId, storeCategoryData) => {
    await valiateStoreId(userId, storeId);
    const storeCategory = await StoreCategory.findById(categoryId);
    if (!storeCategory || storeCategory.store.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found');
    }

    for (let key in storeCategoryData) {
        storeCategory[key] = storeCategoryData[key];
    }

    await storeCategory.save();
    return storeCategory;
}

const getStoreCategoryById = async (userId, storeId, categoryId) => {
    const store = await Store.findById(storeId);
    const storeCategory = await StoreCategory.findById(categoryId);

    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found');
    }
    if (!storeCategory || storeCategory.store.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found');
    }
    return storeCategory;
}

const deleteStoreCategory = async (userId, storeId, categoryId) => {
    await valiateStoreId(userId, storeId);
    const storeCategory = await StoreCategory.findById(categoryId);
    if (!storeCategory || storeCategory.store.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found');
    }
    storeCategory.isDeleted = true;
    await storeCategory.save();
}

async function valiateStoreId(userId, storeId) {
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized User');
    }
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found');
    }
    return store;
}

module.exports = {
    createStore,
    updateStore,
    getStoreInfo,
    deleteStore,
    getStores,
    getStoreById,
    createStoreCategory,
    updateStoreCategoryById,
    getStoreCategoryById,
    deleteStoreCategory,
};
