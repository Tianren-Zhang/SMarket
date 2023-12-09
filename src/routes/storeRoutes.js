const express = require('express');
const storeController = require('../controllers/storeController');
const {body, param} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const checkMerchantRole = require('../middlewares/storeMiddleware/checkMerchantRole');
const checkStoreExists = require('../middlewares/storeMiddleware/checkStoreExists');
const validateAll = require('../middlewares/validate');
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

// **********************  Public APIs  **************************** //

// @route   GET api/store
// @desc    Get all store information
// @access  Public
router.get('/', storeController.getAllStores
);

// @route   GET api/store/:storeId
// @desc    Get a store information
// @access  Public
router.get('/:storeId',
    storeIdValidationRules,
    validateAll,
    storeController.getStoreById
);


// **********************  Private APIs  **************************** //

// @route   POST api/store/
// @desc    Create a store
// @access  Private
router.post('/',
    authMiddleware,
    storeValidationRules,
    checkMerchantRole,
    validateAll,
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
    validateAll,
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
    validateAll,
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
    validateAll,
    storeController.deleteStore
);

// @route   POST api/store/:storeId
// @desc    Create a store category
// @access  Private
router.post('/:storeId/categories',
    authMiddleware,
    storeIdValidationRules,
    checkMerchantRole,
    checkStoreExists,
    validateAll,
    storeController.createStoreCategory
);

// @route   PUT api/store/:storeId
// @desc    Update a store category
// @access  Private
router.put('/:storeId/categories/:categoryId',
    authMiddleware,
    storeIdValidationRules,
    checkMerchantRole,
    checkStoreExists,
    validateAll,
    storeController.updateStoreCategory
);

// @route   GET api/store/:storeId
// @desc    Get a store category
// @access  Private
router.get('/:storeId/categories/:categoryId',
    storeIdValidationRules,
    checkMerchantRole,
    checkStoreExists,
    validateAll,
    storeController.getStoreCategory
);

// @route   DELETE api/store/:storeId
// @desc    Delete a store category
// @access  Private
router.delete('/:storeId/categories/:categoryId',
    authMiddleware,
    storeIdValidationRules,
    checkMerchantRole,
    checkStoreExists,
    validateAll,
    storeController.deleteStoreCategory
);


module.exports = router;
