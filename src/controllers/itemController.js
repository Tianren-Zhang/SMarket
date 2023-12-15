const Item = require('../models/Item');
const {validationResult} = require("express-validator");
const itemService = require("../services/itemService");

// **********************  Public APIs  **************************** //
exports.getAllItems = async (req, res, next) => {
    try {
        const items = await itemService.getItems();
        res.json(items);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

// Retrieve a specific item by ID
exports.getItemById = async (req, res, next) => {
    try {
        const item = await itemService.getItemById(req.params.itemId);
        res.json(item);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.searchByQuery = async (req, res, next) => {
    try {
        const itemData = await itemService.searchByQuery(req.query);
        res.status(200).json({
            success: true,
            message: 'Items fetched successfully',
            data: itemData
        });
    } catch (err) {
        console.error(err.message);
        next(err);

    }
}

// **********************  Private APIs  **************************** //
exports.addItem = async (req, res, next) => {
    try {
        const {storeId} = req.params;
        const item = await itemService.addItemToInventory(storeId, req.user.id, req.body);
        res.json(item);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.updateItem = async (req, res, next) => {
    try {
        const {itemId} = req.params;
        const item = await itemService.updateItemInInventory(req.user.id, itemId, req.body);
        res.json(item);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.deleteItem = async (req, res, next) => {
    try {
        await itemService.deleteItemFromInventory(req.user.id, req.params.itemId);
        res.json({msg: 'Item deleted successfully'});
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};