const StoreCategory = require('../models/StoreCategory');

const findStoreCategoryById = async (storeCategoryId) => {
    return StoreCategory.findById(storeCategoryId).populate('store');
};

const createStoreCategory = async (storeId, storeCategoryData) => {
    const {name, parentCategory, description, images, featured, tags, customFields} = storeCategoryData;

    const newStoreCategory = new StoreCategory({
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
    await newStoreCategory.save();
    return newStoreCategory.toObject();
};

const updateStoreCategory = async (storeCategory, updateData) => {
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
    return storeCategory.toObject();
}

module.exports = {
    findStoreCategoryById,
    createStoreCategory,
    updateStoreCategory,
};