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
        // Other cart item attributes
    }],
    // Other fields as necessary
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
