const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerOrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    individualOrders: [{
        type: Schema.Types.ObjectId,
        ref: 'IndividualOrder'
    }],

    totalAmount: {
        type: Number,
        // Calculate the total amount dynamically from individual orders
        default: function () {
            return this.individualOrders.reduce((total, order) => total + order.orderAmount, 0);
        }
    },

    orderDate: {
        type: Date,
        default: Date.now
    },

    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },

    paymentDetails: {
        method: String,
        status: String,
        transactionId: String
    },

    orderConfirmationNumber: String,
    orderHistory: [{
        status: String,
        date: Date
    }],

    customerContact: {
        email: String,
        phone: String
    }
}, {timestamps: true});

module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema);
