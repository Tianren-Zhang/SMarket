const storeService = require('../services/storeService');
const {validationResult} = require('express-validator');

exports.createStore = async (req, res) => {
    try {
        const store = await storeService.createStore(req.user.id, req.body);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addItem = async (req, res) => {
    const {storeId, itemId} = req.params;
    try {
        const item = await storeService.addItemToInventory(storeId, req.body);
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateItem = async (req, res) => {
    const {itemId} = req.params;
    try {
        const item = await storeService.updateItemInInventory(itemId, req.body);
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getStore = async (req, res) => {
    const {storeId} = req.params;
    try {
        const store = await storeService.getStoreInfo(storeId);
        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.deleteStore = async (req, res) => {
    try {
        await storeService.deleteStore(req.params.storeId);
        res.json({msg: 'Store deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await storeService.deleteItemFromInventory(req.params.itemId);
        res.json({msg: 'Item deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
