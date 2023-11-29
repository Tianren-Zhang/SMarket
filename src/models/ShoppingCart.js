const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingCartItemSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    quantity: {
        type: Number,
        min: 1
    },

    variant: String, // Optional, based on your requirements

}, {timestamps: true});

const ShoppingCartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [ShoppingCartItemSchema],

    // Other fields
}, {timestamps: true});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
