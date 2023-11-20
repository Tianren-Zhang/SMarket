const express = require('express');
const storeController = require('../controllers/storeController');
const {body, param} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// validation rules
const storeIdValidationRules = [
    param('storeId').isMongoId().withMessage('Invalid store ID.'),
]

const itemIdValidationRules = [
    param('itemId').isMongoId().withMessage('Invalid item ID.'),
]

const itemValidationRules = [
    body('name').notEmpty().withMessage('Item name is required.'),
    body('price').isFloat({gt: 0}).withMessage('Item price must be a positive number.'),
    body('description').optional().trim(),
]

const storeValidationRules = [
    body('storeName').trim().notEmpty().withMessage('Store name is required.'),
    body('description').optional().trim(),
    body('logo').optional().isURL().withMessage('Logo must be a valid URL.'),
    body('bannerImage').optional().isURL().withMessage('Banner image must be a valid URL.'),
]


// @route   POST api/store/
// @desc    Create a store
// @access  Private
router.post('/',
    authMiddleware,
    storeValidationRules,
    storeController.createStore
);

// @route   PUT api/store/
// @desc    Update a store information
// @access  Private
router.put(
    '/:storeId',
    authMiddleware,
    storeIdValidationRules,
    storeValidationRules,
    storeController.updateStore
);

// @route   POST api/store/:storeId/item
// @desc    Add an item into a store
// @access  Private
router.post('/:storeId/item',
    authMiddleware,
    storeIdValidationRules,
    itemValidationRules,
    storeController.addItem
);

// @route   PUT api/store/item/:itemId
// @desc    Update an item
// @access  Private
router.put('/item/:itemId',
    authMiddleware,
    itemIdValidationRules,
    itemValidationRules,
    body('images').optional().isURL().withMessage('Image must be a valid URL.'),
    storeController.updateItem
);

// @route   GET api/store/:storeId
// @desc    Get a store information
// @access  Private
router.get('/:storeId',
    authMiddleware,
    storeIdValidationRules,
    storeController.getStore
);

// @route   DELETE api/store/
// @desc    Delete a store
// @access  Private
router.delete('/:storeId',
    authMiddleware,
    storeIdValidationRules,
    storeController.deleteStore
);

// @route   DELETE api/store/
// @desc    Delete an item in a store
// @access  Private
router.delete('/item/:itemId',
    authMiddleware,
    itemIdValidationRules,
    storeController.deleteItem
);

module.exports = router;
