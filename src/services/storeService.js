const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const StoreCategory = require('../models/StoreCategory');
const Store = require('../models/Store');
const Item = require('../models/Item');
const User = require("../models/User");

const getStores = async () => {
    return Store.find().populate('owner', ['username', 'email']);//.select('-isDeleted');

}

const getStoreById = async (storeId) => {
    const store = await Store.findById(storeId).populate('owner', ['username', 'email']);//.select('-isDeleted');
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
    }
    return store;
}

const createStore = async (ownerId, storeData) => {
    const owner = await User.findById(ownerId).populate('userRole');

    const store = new Store({owner: ownerId, storeCategories: [], ...storeData});
    await store.save();

    owner.store.push(store._id);
    await owner.save();

    const storeResponse = store.toObject(); // Convert to a regular object
    delete storeResponse.isDeleted;
    return storeResponse;
};

const updateStore = async (storeId, userId, updateData) => {
    const store = await validateStoreId(userId, storeId);

    return Store.findOneAndUpdate(
        {owner: store.owner},
        {$set: updateData},
        {new: true, upsert: true}
    ).populate('owner', ['username', 'email']).select('-isDeleted');
};

const getStoreInfo = async (storeId) => {
    const store = await Store.findById(storeId)
        .populate('inventory.item')
        .populate('owner', ['username', 'email'])
        .select('-isDeleted');
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
    }
    return store;
};


const deleteStore = async (storeId, userId) => {
    await validateStoreId(userId, storeId);
    // console.log(store.owner);
    await Store.findByIdAndUpdate(storeId, {isDeleted: true});

    // Optionally, also soft delete all items associated with the store
    await Item.updateMany({store: storeId}, {isDeleted: true});
};

const createStoreCategory = async (userId, storeId, storeCategoryData) => {
    const store = await validateStoreId(userId, storeId);
    const {name, parentCategory, description, images, featured, tags, customFields} = storeCategoryData;

    const newCategory = new StoreCategory({
        name,
        store: storeId,
        parentCategory,
        subCategories: [],
        description,
        images,
        featured,
        tags,
        customFields
    });

    await newCategory.save();

    if (parentCategory) {
        const parent = await StoreCategory.findById(parentCategory);
        if (parent) {
            parent.subCategories.push(newCategory._id);
            await parent.save();
        }
    }

    if (!store.storeCategories) {
        store.storeCategories = [];
    }
    store.storeCategories.push(newCategory._id);
    await store.save();

    const storeCategoryResponse = newCategory.toObject(); // Convert to a regular object
    delete storeCategoryResponse.isDeleted;
    return storeCategoryResponse;
}

const updateStoreCategoryById = async (userId, storeId, categoryId, storeCategoryData) => {
    await validateStoreId(userId, storeId);

    const storeCategory = await StoreCategory.findById(categoryId);
    if (!storeCategory || storeCategory.store.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found', 'storeId', storeId, 'params');
    }

    const oldParentId = storeCategory.parentCategory;
    for (let key in storeCategoryData) {
        storeCategory[key] = storeCategoryData[key];
    }

    if (oldParentId === null || oldParentId !== storeCategory.parentCategory) {
        // Remove from old parent's subcategories
        if (oldParentId) {
            const oldParent = await StoreCategory.findById(oldParentId);
            oldParent.subCategories.pull(storeCategory._id);
            await oldParent.save();
        }

        // Add to new parent's subcategories
        if (storeCategory.parentCategory) {
            const newParent = await StoreCategory.findById(storeCategory.parentCategory);
            newParent.subCategories.push(storeCategory._id);
            await newParent.save();
        }
    }

    await storeCategory.save();
    return storeCategory;
}


const getStoreCategoryById = async (storeId, categoryId) => {
    const store = await Store.findById(storeId);
    const storeCategory = await StoreCategory.findById(categoryId);//.select('-isDeleted');

    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
    }
    if (!storeCategory || storeCategory.store.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found', 'categoryId', categoryId, 'params');
    }
    return storeCategory;
}

const deleteStoreCategory = async (userId, storeId, categoryId) => {
    await validateStoreId(userId, storeId);

    const storeCategory = await StoreCategory.findById(categoryId);
    if (!storeCategory || storeCategory.store.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found', 'categoryId', categoryId, 'params');
    }

    // Restrict Deletion If Subcategories Exist
    if (storeCategory.subCategories.length > 0) {
        throw new UnauthorizedError('Cannot delete category with subcategories', 'StoreCategoryId', categoryId, 'params');
    }

    // Remove from parent category's subcategories
    if (storeCategory.parentCategory) {
        const parent = await StoreCategory.findById(storeCategory.parentCategory);
        parent.subCategories.pull(storeCategory._id);
        await parent.save();
    }

    await Item.updateMany({storeCategory: categoryId}, {$set: {storeCategory: null}});

    storeCategory.isDeleted = true;
    await storeCategory.save();
}


async function validateStoreId(userId, storeId) {
    const store = await Store.findById(storeId);
    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
    }
    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized User', 'userId', userId, 'header');
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
