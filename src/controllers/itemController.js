const Item = require('../models/Item');
const {validationResult} = require("express-validator");
const itemService = require("../services/itemService");

exports.addItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {storeId, itemId} = req.params;
        const item = await itemService.addItemToInventory(storeId, req.user.id, req.body);
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.updateItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {itemId} = req.params;
        const item = await itemService.updateItemInInventory(req.user.id, itemId, req.body);
        res.json(item);
    } catch (error) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.deleteItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        await itemService.deleteItemFromInventory(req.params.itemId, req.user.id);
        res.json({msg: 'Item deleted successfully'});
    } catch (error) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};


// Retrieve all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await itemService.getItems();
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

// Retrieve a specific item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await itemService.getItemById(req.params.itemId);
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};
