const storeService = require('../services/storeService');
const {validationResult} = require('express-validator');

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
    } catch (error) {
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
    } catch (error) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

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


