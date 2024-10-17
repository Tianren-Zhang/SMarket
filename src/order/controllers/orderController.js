const orderService = require('../services/orderService');

// **********************  Public APIs  **************************** //
exports.getAllCustomerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllCustomerOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.getAllIndividualOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllIndividualOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

// **********************  Private APIs  **************************** //
exports.placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.getOrderHistory = async (req, res, next) => {
  try {
    const orders = await orderService.getOrderHistory(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.user.id,
      req.params.orderId
    );
    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.updateOrderDetails = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderById(
      req.user.id,
      req.params.orderId,
      req.body
    );
    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    await orderService.cancelOrder(
      req.user.id,
      req.params.customerOrderId,
      req.body
    );
    res.json({ msg: 'Order cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};
