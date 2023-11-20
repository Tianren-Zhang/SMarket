const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },

        quantity: {
            type: Number,
            required: true
        },

        variant: String,

        createAt: {
            type: Date,
            default: Date.now()
        }
        // Other cart item attributes
    }],

    // Dynamically calculated based on items
    totalPrice: Number,

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    // Other fields
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
