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
const User = require('../models/User');

const getStores = async () => {
  return await storeRepository.getAllStores();
};

const getStoreById = async (storeId) => {
  const store = await storeRepository.findStoreById(storeId);
  if (!store || store.isDeleted) {
    throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
  }
  return store;
};

const createStore = async (ownerId, storeData) => {
  const owner = await userRepository.findUserById(ownerId);

  const store = await storeRepository.createStore(owner, storeData);
  console.log(store);
  owner.store.push(store._id);
  await owner.save();

  delete store.isDeleted;
  store.owner.store.push(store._id);
  return store;
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
  const newStoreCategory = await storeCategoryRepository.createStoreCategory(
    storeId,
    storeCategoryData
  );
  console.log(newStoreCategory);
  if (storeCategoryData.parentCategory) {
    const parent = await storeCategoryRepository.findStoreCategoryById(
      storeCategoryData.parentCategory
    );
    if (parent) {
      parent.subCategories.push(newStoreCategory._id);
      await parent.save();
    }
  }

  if (!store.storeCategories) {
    store.storeCategories = [];
  }
  console.log(newStoreCategory);
  store.storeCategories.push(newStoreCategory._id);
  await store.save();

  delete newStoreCategory.isDeleted;
  return newStoreCategory;
};

const updateStoreCategoryById = async (
  userId,
  storeId,
  categoryId,
  storeCategoryData
) => {
  await storeValidation.validateStoreAndOwner(storeId, userId);

  const storeCategory = await storeCategoryRepository.findStoreCategoryById(
    categoryId
  );
  if (
    !storeCategory ||
    storeCategory.store._id.toString() !== storeId ||
    storeCategory.isDeleted
  ) {
    throw new NotFoundError(
      'Store category not found',
      'storeCategoryId',
      categoryId,
      'params'
    );
  }

  const storeCategoryUpdate = await storeCategoryRepository.updateStoreCategory(
    storeCategory,
    storeCategoryData
  );
  delete storeCategoryUpdate.isDeleted;
  return storeCategoryUpdate;
};

const getStoreCategoryById = async (storeId, categoryId) => {
  return await storeCategoryValidation.validateStoreCategory(
    categoryId,
    storeId
  );
};

const deleteStoreCategory = async (userId, storeId, categoryId) => {
  await storeValidation.validateStoreAndOwner(storeId, userId);

  const storeCategory = await storeCategoryValidation.validateStoreCategory(
    categoryId,
    storeId
  );

  // Restrict Deletion If Subcategories Exist
  if (storeCategory.subCategories.length > 0) {
    throw new UnauthorizedError(
      'Cannot delete category with subcategories',
      'StoreCategoryId',
      categoryId,
      'params'
    );
  }

  // Remove from parent category's subcategories
  if (storeCategory.parentCategory) {
    const parent = await StoreCategory.findById(storeCategory.parentCategory);
    parent.subCategories.pull(storeCategory._id);
    await parent.save();
  }

  await Item.updateMany(
    { storeCategory: categoryId },
    { $set: { storeCategory: null } }
  );

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
