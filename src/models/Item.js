const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: String,

    // A flexible object to store item-specific details
    specifications: {},

    // URLs to images of the item
    images: [String],

    quantity: {
        type: Number,
        required: true,
        default: 0,
    },

    // Additional fields
});

module.exports = mongoose.model('Item', ItemSchema);

