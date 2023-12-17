const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const StoreCategory = require('../models/StoreCategory');
const storeRepository = require('../repository/storeRepository');
const userRepository = require('../repository/userRepository');
const storeCategoryRepository = require('../repository/storeCategoryRepository');
const storeValidation = require('../validation/storeValidation');
const storeCategoryValidation = require('../validation/storeCategoryValidation');
const Store = require('../models/Store');
const Item = require('../models/Item');
const User = require("../models/User");

const getStores = async () => {
    return await storeRepository.getAllStores();
}

const getStoreById = async (storeId) => {
    return await storeRepository.findStoreById(storeId);
};

const createStore = async (ownerId, storeData) => {
    const owner = await userRepository.findUserById(ownerId);

    const store = storeRepository.createStore(owner, storeData);

    owner.store.push(store._id);
    await owner.save();

    const storeResponse = store.toObject(); // Convert to a regular object
    delete storeResponse.isDeleted;
    return storeResponse;
};

const updateStore = async (storeId, userId, updateData) => {
    await storeValidation.validateStoreAndOwner(storeId, userId);
    return storeRepository.updateStore(storeId, updateData);
};

const getStoreInfo = async (storeId) => {
    return await storeRepository.getStoreInfo(storeId);
};

const deleteStore = async (storeId, userId) => {
    await storeValidation.validateStoreAndOwner(storeId, userId);
    // console.log(store.owner);
    await storeRepository.deleteStore(storeId);
};

const createStoreCategory = async (userId, storeId, storeCategoryData) => {
    const store = await storeValidation.validateStoreAndOwner(storeId, userId);
    const newStoreCategory = storeCategoryRepository.createStoreCategory(store, storeCategoryData);

    if (storeCategoryData.parentCategory) {
        const parent = await storeCategoryRepository.findStoreCategoryById(storeCategoryData.parentCategory);
        if (parent) {
            parent.subCategories.push(newStoreCategory._id);
            await parent.save();
        }
    }

    if (!store.storeCategories) {
        store.storeCategories = [];
    }
    store.storeCategories.push(newStoreCategory._id);
    await store.save();


    delete newStoreCategory.isDeleted;
    return newStoreCategory;
};

const updateStoreCategoryById = async (userId, storeId, categoryId, storeCategoryData) => {
    await storeValidation.validateStoreAndOwner(storeId, userId);

    const storeCategory = await storeCategoryRepository.findStoreCategoryById(categoryId);
    if (!storeCategory || storeCategory.store.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found', 'storeId', storeId, 'params');
    }

    const storeCategoryUpdate = await storeCategoryRepository.updateStoreCategory(storeCategory, storeCategoryData);
    delete storeCategoryUpdate.isDeleted;
    return storeCategoryUpdate;
};

const getStoreCategoryById = async (storeId, categoryId) => {
    return await storeCategoryValidation.validateStoreCategory(categoryId, storeId);
};

const deleteStoreCategory = async (userId, storeId, categoryId) => {
    await storeValidation.validateStoreAndOwner(storeId, userId);

    const storeCategory = await storeCategoryValidation.validateStoreCategory(categoryId, storeId);

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
};


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
