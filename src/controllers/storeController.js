const storeService = require('../services/storeService');
const {validationResult} = require('express-validator');

// **********************  Public APIs  **************************** //
exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeService.getStores();
        res.json(stores);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const store = await storeService.getStoreById(req.params.storeId)
        res.json(store);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Store not found'});
        }
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

// **********************  Private APIs  **************************** //
exports.createStore = async (req, res) => {
    try {
        const store = await storeService.createStore(req.user.id, req.body);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.updateStore = async (req, res) => {
    try {
        const updatedStore = await storeService.updateStore(req.params.storeId, req.user.id, req.body);
        if (!updatedStore) {
            return res.status(404).json({msg: 'Store not found'});
        }
        res.json(updatedStore);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getStore = async (req, res) => {
    try {
        const {storeId} = req.params;
        const store = await storeService.getStoreInfo(storeId);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};


exports.deleteStore = async (req, res) => {
    try {
        await storeService.deleteStore(req.params.storeId, req.user.id);
        res.json({msg: 'Store deleted successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
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

exports.updateStoreCategory = async (req, res) => {
    try {
        const storeCategory = await storeService.updateStoreCategoryById(req.user.id, req.params.storeId, req.params.categoryId, req.body);
        res.json(storeCategory);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getStoreCategory = async (req, res) => {
    try {
        const storeCategory = await storeService.getStoreCategoryById(req.user.id, req.params.storeId, req.params.categoryId);
        res.json(storeCategory);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.deleteStoreCategory = async (req, res) => {
    try {
        const stores = await storeService.deleteStoreCategory();
        res.json({msg: 'Category deleted successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};


