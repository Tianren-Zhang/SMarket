const storeService = require('../services/storeService');
const {validationResult} = require('express-validator');

exports.createStore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const store = await storeService.createStore(req.user.id, req.body);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateStore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const updatedStore = await storeService.updateStore(req.params.storeId, req.user.id, req.body);
        if (!updatedStore) {
            return res.status(404).json({msg: 'Store not found'});
        }
        res.json(updatedStore);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.addItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {storeId, itemId} = req.params;
        const item = await storeService.addItemToInventory(storeId, req.user.id, req.body);
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {itemId} = req.params;
        const item = await storeService.updateItemInInventory(req.user.id, itemId, req.body);
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getStore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {storeId} = req.params;
        const store = await storeService.getStoreInfo(storeId);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.deleteStore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        await storeService.deleteStore(req.params.storeId, req.user.id);
        res.json({msg: 'Store deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        await storeService.deleteItemFromInventory(req.params.itemId, req.user.id);
        res.json({msg: 'Item deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
