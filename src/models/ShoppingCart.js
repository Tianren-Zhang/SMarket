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

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },
});

const ShoppingCartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [ShoppingCartItemSchema],

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


ShoppingCartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    this.items.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
