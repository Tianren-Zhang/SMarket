const Store = require('../models/Store');
const Item = require('../models/Item');
const NotFoundError = require('../exceptions/NotFoundError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

const getAllStores = async () => {
  return Store.find().populate('owner', ['username', 'email']);
};

const findStoreById = async (storeId) => {
  const store = await Store.findById(storeId);
  if (!store || store.isDeleted) {
    throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
  }
  return store;
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

const createStore = async (ownerId, storeData) => {
  const store = new Store({
    owner: ownerId,
    storeCategories: [],
    ...storeData,
  });
  await store.save();

  return store.toObject();
};

const updateStore = async (storeId, updateData) => {
  return Store.findByIdAndUpdate(
    storeId,
    { $set: updateData },
    { new: true, upsert: true }
  )
    .populate('owner', ['username', 'email'])
    .select('-isDeleted');
};

const deleteStore = async (storeId, userId) => {
  await Store.findByIdAndUpdate(storeId, { isDeleted: true });

  // Optionally, also soft delete all items associated with the store
  await Item.updateMany({ store: storeId }, { isDeleted: true });
};

const addToInventory = async (storeId, item, existingStore = null) => {
  const store = existingStore
    ? existingStore
    : await this.findStoreById(storeId);
  if (!store) {
    throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
  }
  store.inventory.push(item);
  await store.save();
  return store;
};

const removeFromInventory = async (storeId, itemId) => {
  await Store.findByIdAndUpdate(storeId, { $pull: { inventory: itemId } });
};

module.exports = {
  getAllStores,
  findStoreById,
  getStoreInfo,
  createStore,
  updateStore,
  deleteStore,
  addToInventory,
  removeFromInventory,
};
