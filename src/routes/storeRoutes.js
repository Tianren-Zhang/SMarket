const express = require('express');
const storeController = require('../controllers/storeController');
const {body, param} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const checkMerchantRole = require('../middlewares/storeMiddleware/checkMerchantRole');
const checkStoreExists = require('../middlewares/storeMiddleware/checkStoreExists');
const itemController = require("../controllers/itemController");
const router = express.Router();

// validation rules
const storeIdValidationRules = [
    param('storeId').isMongoId().withMessage('Invalid store ID.'),
]

const storeValidationRules = [
    body('storeName').trim().notEmpty().withMessage('Store name is required.'),
    body('description').optional().trim(),
    body('logo').optional().isURL().withMessage('Logo must be a valid URL.'),
    body('bannerImage').optional().isURL().withMessage('Banner image must be a valid URL.'),
]

// ************************************************** //
// Public APIs

// @route   GET api/store
// @desc    Get all store information
// @access  Public
router.get('/', storeController.getAllStores);

// @route   GET api/store/:storeId
// @desc    Get a store information
// @access  Public
router.get('/:storeId',
    storeIdValidationRules,
    storeController.getStoreById);


// ************************************************** //
// Private APIs

// @route   POST api/store/
// @desc    Create a store
// @access  Private
router.post('/',
    authMiddleware,
    storeValidationRules,
    checkMerchantRole,
    storeController.createStore
);

// @route   PUT api/store/:storeId
// @desc    Update a store information
// @access  Private
router.put(
    '/:storeId',
    authMiddleware,
    storeIdValidationRules,
    storeValidationRules,
    checkMerchantRole,
    checkStoreExists,
    storeController.updateStore
);

// @route   GET api/store/:storeId
// @desc    Get a store information
// @access  Private
router.get('/:storeId',
    authMiddleware,
    storeIdValidationRules,
    checkMerchantRole,
    checkStoreExists,
    storeController.getStore
);

// @route   DELETE api/store/:storeId
// @desc    Delete a store
// @access  Private
router.delete('/:storeId',
    authMiddleware,
    storeIdValidationRules,
    checkMerchantRole,
    checkStoreExists,
    storeController.deleteStore
);


module.exports = router;
