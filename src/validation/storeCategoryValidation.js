const storeCategoryRepository = require("../repository/storeCategoryRepository");
const NotFoundError = require("../exceptions/NotFoundError");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
const validateStoreCategory = async (storeCategoryId, storeId) => {
    const storeCategory = await storeCategoryRepository.findStoreCategoryById(storeCategoryId);
    if (!storeCategory || storeCategory.isDeleted) {
        throw new NotFoundError('Store Category not found', 'storeCategory', storeCategoryId, 'body');
    }
    // console.log(storeId);
    // console.log(storeCategory.store._id);
    if (storeCategory.store._id.toString() !== storeId.toString()) {
        throw new UnauthorizedError('Unauthorized User', 'user', storeId);
    }
    return storeCategory;
};

module.exports = {
    validateStoreCategory,

}