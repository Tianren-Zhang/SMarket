const StoreCategory = require('../../models/StoreCategory');
const storeValidation = require('../validations/storeValidation');
const findStoreCategoryById = async (storeCategoryId) => {
  return StoreCategory.findById(storeCategoryId); //.populate('store');
};

const createStoreCategory = async (storeId, storeCategoryData) => {
  const {
    name,
    parentCategory,
    description,
    images,
    featured,
    tags,
    customFields,
  } = storeCategoryData;

  const newStoreCategory = new StoreCategory({
    name,
    store: storeId,
    parentCategory,
    subCategories: [],
    description,
    images,
    featured,
    tags,
    customFields,
  });
  console.log(newStoreCategory);
  await newStoreCategory.save();
  return newStoreCategory.toObject();
};

const updateStoreCategory = async (storeCategory, updateData, userId) => {
  const oldParentId = storeCategory.parentCategory;
  if (updateData.parentCategory) {
    await storeValidation.validateStoreAndOwner(
      updateData.parentCategory,
      userId
    );
  }
  for (let key in updateData) {
    storeCategory[key] = updateData[key];
  }
  console.log(storeCategory.parentCategory);
  if (oldParentId === null || oldParentId !== storeCategory.parentCategory) {
    // Remove from old parent's subcategories
    if (oldParentId) {
      const oldParent = await StoreCategory.findById(oldParentId);
      console.log(oldParent);
      oldParent.subCategories.pull(storeCategory._id);
      await oldParent.save();
    }

    // Add to new parent's subcategories
    if (storeCategory.parentCategory) {
      const newParent = await StoreCategory.findById(
        storeCategory.parentCategory
      );
      console.log(newParent);
      newParent.subCategories.push(storeCategory._id);
      await newParent.save();
    }
  }

  await storeCategory.save();
  return storeCategory.toObject();
};

module.exports = {
  findStoreCategoryById,
  createStoreCategory,
  updateStoreCategory,
};
