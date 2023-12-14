const storeService = require('../services/storeService');
const {validationResult} = require('express-validator');

// **********************  Public APIs  **************************** //
exports.getAllStores = async (req, res, next) => {
    try {
        const stores = await storeService.getStores();
        res.json(stores);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getStoreById = async (req, res, next) => {
    try {
        const store = await storeService.getStoreById(req.params.storeId)
        res.json(store);
    } catch (err) {

        console.error(err.message);
        next(err);
    }
};

// **********************  Private APIs  **************************** //
exports.createStore = async (req, res, next) => {
    try {
        const store = await storeService.createStore(req.user.id, req.body);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.updateStore = async (req, res, next) => {
    try {
        const updatedStore = await storeService.updateStore(req.params.storeId, req.user.id, req.body);
        res.json(updatedStore);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getStore = async (req, res, next) => {
    try {
        const {storeId} = req.params;
        const store = await storeService.getStoreInfo(storeId);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};


exports.deleteStore = async (req, res, next) => {
    try {
        await storeService.deleteStore(req.params.storeId, req.user.id);
        res.json({msg: 'Store deleted successfully'});
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.createStoreCategory = async (req, res, next) => {
    try {
        const storeCategory = await storeService.createStoreCategory(req.user.id, req.params.storeId, req.body);
        res.json(storeCategory);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.updateStoreCategory = async (req, res, next) => {
    try {
        const storeCategory = await storeService.updateStoreCategoryById(req.user.id, req.params.storeId, req.params.categoryId, req.body);
        // console.log(req.body);
        res.json(storeCategory);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getStoreCategory = async (req, res, next) => {
    try {
        // console.log(req.params.storeId);
        // console.log(req.params.categoryId);
        const storeCategory = await storeService.getStoreCategoryById(req.params.storeId, req.params.categoryId);
        res.json(storeCategory);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.deleteStoreCategory = async (req, res, next) => {
    try {
        const stores = await storeService.deleteStoreCategory(req.user.id, req.params.storeId, req.params.categoryId);
        res.json({msg: 'Category deleted successfully'});
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};


