const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemVariantSchema = new Schema({
    variantType: String, // e.g., 'Color', 'Storage'
    variantValue: String // e.g., 'Black', '256GB'
});

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

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    description: String,

    // A flexible object to store item-specific details
    variants: [ItemVariantSchema],

    // URLs to images of the item
    images: [{
        url: String,
        altText: String
    }],


    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative'],
        default: 0,
    },

    // sku: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

    ratings: {
        average: {type: Number, default: 0},
        count: {type: Number, default: 0}
    },

    reviews: [{
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        review: String,
        rating: Number,
        createdAt: {type: Date, default: Date.now}
    }],

    //Search Engine Optimization
    seo: {
        metaTitle: String,
        metaDescription: String
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

}, {timestamps: true});

module.exports = mongoose.model('Item', ItemSchema);

