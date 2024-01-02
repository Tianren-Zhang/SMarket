const storeCategoryRepository = require("../repository/storeCategoryRepository");
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
const storeRepository = require("../repository/storeRepository");
const validateStoreCategory = async (storeCategoryId, storeId) => {
    const store = await storeRepository.findStoreById(storeId);
    const storeCategory = await storeCategoryRepository.findStoreCategoryById(storeCategoryId);

    if (!store || store.isDeleted) {
        throw new NotFoundError('Store not found', 'storeId', storeId, 'params');
    }

    if (!storeCategory || storeCategory.store._id.toString() !== storeId || storeCategory.isDeleted) {
        throw new NotFoundError('Store category not found', 'categoryId', storeCategoryId, 'params');
    }
    return storeCategory;
};

module.exports = {
    validateStoreCategory,

};