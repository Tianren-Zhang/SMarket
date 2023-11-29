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
        itemName: String,
        itemDescription: String,
        itemSKU: String,
        quantity: {type: Number, min: 1},
        price: Number, // Price per item
        discount: Number, // Optional discount per item
        // Calculate subtotal for item
        get subtotal() {
            return (this.quantity * this.price) - (this.discount || 0);
        }
    }],

    orderAmount: {
        type: Number,
        // Calculate total order amount
        default: function () {
            return this.items.reduce((total, item) => total + item.subtotal, 0);
        }
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
    }
}, {timestamps: true});

module.exports = mongoose.model('IndividualOrder', IndividualOrderSchema);
