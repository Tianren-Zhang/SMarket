const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const checkCategoryExists = require('../middlewares/storeMiddleware/checkCategoryExists');
const checkItemExists = require('../middlewares/storeMiddleware/checkItemExists');
const checkMerchantRole = require('../middlewares/storeMiddleware/checkMerchantRole');
const checkStoreExists = require('../middlewares/storeMiddleware/checkStoreExists');
const validateAll = require('../middlewares/validate');
const itemController = require('../controllers/itemController');
const {body, param} = require('express-validator');
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
    body('category').isMongoId().withMessage('Invalid category ID.'),
]
// **********************  Public APIs  **************************** //

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/',
    itemController.getAllItems
);

// @route   GET api/items/:itemId
// @desc    Get an item based on ID
// @access  Public
router.get('/:itemId',
    itemIdValidationRules,
    validateAll,
    itemController.getItemById
);

router.get('/search',
    itemController.searchByQuery
);


// **********************  Private APIs  **************************** //

// @route   POST api/items/:storeId
// @desc    Add an item into a store
// @access  Private
router.post('/:storeId',
    authMiddleware,
    storeIdValidationRules,
    itemValidationRules,
    body('storyCategory').optional().isMongoId().withMessage('Invalid store category ID.'),
    checkMerchantRole,
    checkStoreExists,
    checkCategoryExists,
    validateAll,
    itemController.addItem
);

// @route   PUT api/items/:itemId
// @desc    Update an item
// @access  Private
router.put('/:itemId',
    authMiddleware,
    itemIdValidationRules,
    body('name').optional().notEmpty().withMessage('Item name is required.'),
    body('price').optional().isFloat({gt: 0}).withMessage('Item price must be a positive number.'),
    body('description').optional().trim(),
    body('category').optional().isMongoId().withMessage('Invalid category ID.'),
    checkMerchantRole,
    body('storyCategory').optional().isMongoId().withMessage('Invalid category ID.'),
    checkItemExists,
    body('images').optional().isURL().withMessage('Image must be a valid URL.'),
    validateAll,
    itemController.updateItem
);

// @route   DELETE api/items/:itemId
// @desc    Delete an item in a store
// @access  Private
router.delete('/:itemId',
    authMiddleware,
    itemIdValidationRules,
    checkMerchantRole,
    checkItemExists,
    validateAll,
    itemController.deleteItem
);

module.exports = router;