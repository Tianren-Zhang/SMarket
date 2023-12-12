const CustomerOrder = require('../models/CustomerOrder');
const IndividualOrder = require('../models/IndividualOrder');
const Item = require("../models/Item");
const NotFoundError = require("../exceptions/NotFoundError");
const {log} = require("debug");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
// Other required models...

const createOrder = async (userId, orderData) => {
    // Validation check
    let individualOrders = [];
    const storeItemsMap = {};
    const storeQuantityMap = {};
    for (const items of orderData.items) {
        const itemId = items.itemId;
        const quantity = parseInt(items.quantity, 10);

        const item = await Item.findById(itemId);
        if (!item) {
            throw new NotFoundError('Item not found', 'itemId', itemId, 'body');
        }
        if (item.quantity < quantity) {
            throw new Error('No enough items');
        }
        item.quantity -= quantity;
        await item.save();

        if (!storeItemsMap[item.store]) {
            storeItemsMap[item.store] = [];
        }
        if (!storeQuantityMap[item.store]) {
            storeQuantityMap[item.store] = {
                totalQuantity: 0,
                orderAmount: 0
            };
        }
        storeQuantityMap[item.store].totalQuantity += quantity;
        storeQuantityMap[item.store].orderAmount += quantity * item.price;
        storeItemsMap[item.store].push({
            item: itemId,
            quantity: quantity,
            // other item details
        });
        //console.log(item.store);
        //console.log(`Item ID: ${itemId}, Quantity: ${quantity}`);
    }

    const newCustomerOrder = new CustomerOrder({user: userId});
    newCustomerOrder.individualOrders = [];
    await newCustomerOrder.save();
    for (const [storeId, items] of Object.entries(storeItemsMap)) {
        //console.log("For loop start");
        //console.log(items);
        //console.log(`${storeQuantityMap[storeId].totalQuantity}, ${storeQuantityMap[storeId].orderAmount}`)
        const newIndividualOrder = new IndividualOrder({
            store: storeId,
            orderAmount: storeQuantityMap[storeId].orderAmount,
            totalQuantity: storeQuantityMap[storeId].totalQuantity,
            orderHistory: [{
                status: 'pending',
                date: Date.now()
            }],
            items: items
        });
        //console.log("New Individual Order Created");
        console.log(newIndividualOrder);
        await newIndividualOrder.save();
        //console.log("Order saved");
        newCustomerOrder.individualOrders.push(newIndividualOrder._id);
        // need to set merchant alert and more business logic
    }

    await newCustomerOrder.save();

    return newCustomerOrder;
};

const getOrderHistory = async (userId) => {
    return CustomerOrder.find({user: userId});
};

const getOrderById = async (userId, orderId) => {
    return CustomerOrder.findById(orderId).populate('individualOrders');
};

const updateOrderById = async (userId, orderId, newStatus) => {
    // Logic to update the status of an order
};

const cancelOrder = async (userId, customerOrderId, orderData) => {
    const customerOrder = await CustomerOrder.findById(customerOrderId);
    if (!customerOrder) {
        throw new NotFoundError('Order not found', 'customerOrderId', customerOrderId, 'params');
    }
    if (customerOrder.user.toString() !== userId) {
        throw new UnauthorizedError('User does not have permission to update this item', 'user', userid, 'header');
    }
    // console.log(customerOrder);

    // Valid the individual Order and the consistency
    let validIndividualOrder = [];
    for (const individualOrderId of orderData.individualOrder) {
        const order = await IndividualOrder.findById(individualOrderId);
        if (!order) {
            throw new NotFoundError('Order not found', 'individualOrderId', individualOrderId, 'body');
        }
        if (!customerOrder.individualOrders.includes(individualOrderId)) {
            throw new NotFoundError('Order not found', 'individualOrderId', individualOrderId, 'body');
        }
        // console.log(order);
        // console.log(customerOrder.individualOrders.includes(individualOrderId));
        validIndividualOrder.push(order);
    }

    for (const individualOrder of validIndividualOrder) {
        if (individualOrder.status !== 'pending') {
            throw new UnauthorizedError('User does not have permission to update this item', 'user', userid, 'header');
        }
        // console.log(individualOrder);
        individualOrder.status = 'cancelled';

        individualOrder.orderHistory.push({
            status: 'cancelled',
            date: Date.now()
        });
        // console.log(individualOrder);
        await individualOrder.save();
    }
};

const getAllCustomerOrders = async () => {
    return CustomerOrder.find().populate('individualOrders');
}

const getAllIndividualOrders = async () => {
    return IndividualOrder.find();
}
module.exports = {
    createOrder,
    getOrderHistory,
    getOrderById,
    updateOrderById,
    cancelOrder,
    getAllCustomerOrders,
    getAllIndividualOrders
};


