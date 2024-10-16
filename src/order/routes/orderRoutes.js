const express = require('express');
const orderController = require('../../order/controllers/orderController');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkCustomerRole = require('../../middlewares/checkCustomerRole');
const validateAll = require('../../middlewares/validate');
const { body } = require('express-validator');
const router = express.Router();

const placeOrderValidationRules = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.itemId')
    .isMongoId()
    .withMessage('Each itemId must be a valid ObjectId'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each quantity must be an integer greater than 0'),
];

const cancelOrderValidationRules = [
  body('customerOrder')
    .isMongoId()
    .withMessage('Customer Order Id must be a valid ObjectId'),
  body('individualOrder')
    .isArray()
    .withMessage('Individual Order must be an array'),
  body('individualOrder.*')
    .isMongoId()
    .withMessage('Each individual order Id must be a valid ObjectId'),
];

// **********************  Public APIs  **************************** //

// @route   GET api/order/customer
// @desc    Get all customer order information
// @access  Public
router.get('/customer', orderController.getAllCustomerOrders);

// @route   GET api/order/merchant
// @desc    Get all individual order information
// @access  Public
router.get('/merchant', orderController.getAllIndividualOrders);

// **********************  Private APIs  **************************** //

// @route   POST api/order/
// @desc    Place an order for customer
// @access  Private
router.post(
  '/',
  authMiddleware,
  checkCustomerRole,
  placeOrderValidationRules,
  validateAll,
  orderController.placeOrder
);

// @route   GET api/order/me
// @desc    Get customer order for a customer
// @access  Private
router.get(
  '/me',
  authMiddleware,
  checkCustomerRole,
  validateAll,
  orderController.getOrderHistory
);

// @route   GET api/order/:orderId
// @desc    Get customer order information based on order id
// @access  Private
router.get(
  '/me/:orderId',
  authMiddleware,
  checkCustomerRole,
  body('orderId')
    .isMongoId()
    .withMessage('Each orderId must be a valid ObjectId'),
  validateAll,
  orderController.getOrderDetails
);

// @route   PUT api/order/:orderId/
// @desc    Update the order information based on order id (not decided)
// @access  Private
router.put(
  '/:orderId',
  authMiddleware,
  checkCustomerRole,
  body('orderId')
    .isMongoId()
    .withMessage('Each orderId must be a valid ObjectId'),
  validateAll,
  orderController.updateOrderDetails
);

// @route   DELETE api/order/
// @desc    Cancel an order based on the customer id and individual ids
// @access  Private
router.delete(
  '/:customerOrderId',
  authMiddleware,
  checkCustomerRole,
  cancelOrderValidationRules,
  validateAll,
  orderController.cancelOrder
);

module.exports = router;
