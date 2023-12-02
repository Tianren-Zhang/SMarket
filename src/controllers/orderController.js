const orderService = require("../services/orderService");


exports.placeOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.user.id, req.body);
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await orderService.getOrderHistory(req.user.id);
        res.status(201).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.user.id, req.params.orderId);
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.updateOrderDetails = async (req, res) => {
    try {
        const order = await orderService.updateOrderById(req.user.id, req.params.orderId, req.body);
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        await orderService.cancelOrder(req.user.id, req.body);
        res.json({msg: 'Order cancelled successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getAllCustomerOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllCustomerOrders();
        res.status(201).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
}

exports.getAllIndividualOrders = async (req, res) => {

    try {
        const orders = await orderService.getAllIndividualOrders();
        res.status(201).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
}
