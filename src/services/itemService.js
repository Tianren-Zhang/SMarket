const NotFoundError = require('../exceptions/NotFoundError');
const itemRepository = require('../repository/itemRepository');
const storeRepository = require('../repository/storeRepository');
const itemValidation = require('../validation/itemValidation');
const storeCategoryValidation = require('../validation/storeCategoryValidation');

const getItems = async () => {
  const items = await itemRepository.getAllItems();
  return items;
};

const getItemById = async (itemId) => {
  const item = await itemRepository.findItemById(itemId);
  if (!item) {
    throw new NotFoundError('Item not found', 'itemId', itemId, 'params');
  }
  return item;
};

const searchByQuery = async (query) => {
  const matchQuery = {};
  const sortQuery = {};
  const limit = parseInt(query.limit, 10) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  if (query.categoryId) {
    matchQuery.category = query.categoryId;
  }

  if (query.keyword) {
    matchQuery.$text = { $search: query.keyword, $caseSensitive: false };
  }

  if (query.minPrice || query.maxPrice) {
    matchQuery.price = {};

    if (query.minPrice) {
      matchQuery.price.$gte = parseFloat(query.minPrice);
    }

    if (query.maxPrice) {
      matchQuery.price.$lte = parseFloat(query.maxPrice);
    }
  }

  if (query.minRating) {
    matchQuery['ratings.average'] = { $gte: parseFloat(query.minRating) };
  }

  // Add more dynamic filtering logic here if necessary

  if (query.sortBy) {
    const parts = query.sortBy.split(':');
    sortQuery[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  matchQuery.isDeleted = { $ne: true };
  const { items, totalItems } = await itemRepository.searchByQuery(
    matchQuery,
    sortQuery,
    skip,
    limit
  );

  return { items, totalItems, page, limit };
};

const addItemToInventory = async (storeId, userId, itemData) => {
  const store = await itemValidation.validateStoreAndOwner(storeId, userId);

  // Validate store category if provided
  if (itemData.storeCategory) {
    await storeCategoryValidation.validateStoreCategory(
      itemData.storeCategory,
      storeId
    );
  }

  // Create new item
  const newItem = await itemRepository.createItem({
    store: storeId,
    ...itemData,
  });

  // Add item to store inventory
  await storeRepository.addToInventory(storeId, newItem, store);

  // Remove sensitive data before response
  delete newItem.isDeleted;
  return newItem;
};

const updateItemInInventory = async (userId, itemId, updateData) => {
  const item = await itemValidation.checkItemOwnership(userId, itemId);

  if (updateData.storeCategory) {
    await storeCategoryValidation.validateStoreCategory(
      updateData.storeCategory,
      item.store._id
    );
  }

  return await itemRepository.updateItem(itemId, updateData);
};

const deleteItemFromInventory = async (userId, itemId) => {
  const item = await itemValidation.checkItemOwnership(userId, itemId);

  await storeRepository.removeFromInventory(item.store, itemId);

  await itemRepository.deleteItem(itemId, item);
};

module.exports = {
  deleteItemFromInventory,
  addItemToInventory,
  updateItemInInventory,
  getItemById,
  getItems,
  searchByQuery,
};
