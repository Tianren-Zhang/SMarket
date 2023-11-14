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
        createAt: {
            type: Date,
            default: Date.now()
        }
        // Other cart item attributes
    }],
    // Other fields
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
