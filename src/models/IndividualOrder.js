const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IndividualOrderSchema = new Schema({
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },

    items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        quantity: {type: Number, min: 1},
        price: Number, // Price per item
        discount: Number, // Optional discount per item
    }],

    orderAmount: {
        type: Number,
    },

    totalQuantity: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    shippingDetails: {
        address: String,
        method: String,
        estimatedDeliveryDate: Date
    },

    paymentDetails: {
        isPaid: Boolean,
        paymentMethod: String
    },

    // orderConfirmationNumber: {
    //     type: String,
    //     unique: true
    // },

    orderHistory: [{
        status: String,
        date: Date
    }],

}, {timestamps: true});

module.exports = mongoose.model('IndividualOrder', IndividualOrderSchema);
