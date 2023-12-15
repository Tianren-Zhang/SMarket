const StoreCategory = require('../models/StoreCategory');

const findStoreCategoryById = async (storeCategoryId) => {
    return StoreCategory.findById(storeCategoryId).populate('store');
}

module.exports = {
    findStoreCategoryById,

}