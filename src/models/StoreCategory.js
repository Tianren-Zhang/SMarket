const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },

    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },

    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'storeCategory',
        default: null // null for first-level categories
    },
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'storeCategory'
    }],

    description: String,

    customAttributes: Map,

    images: {
        url: String,
        altText: String
    },

    featured: Boolean,

    tags: [String],

    customFields: {},

    isDelete: {
        type: Boolean,
        default: false
    },

}, {timestamps: true});

module.exports = mongoose.model('storeCategory', StoreCategorySchema);