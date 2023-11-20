const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    storeName: {
        type: String,
        required: true
    },

    description: String,

    logo: String, // URL to the store's logo

    bannerImage: String, // URL to the store's banner image

    ratings: [{
        rating: Number,
        reviewer: {type: Schema.Types.ObjectId, ref: 'User'},
        review: String,
        createdAt: {type: Date, default: Date.now}
    }],

    operationalHours: {
        open: String,
        close: String,
        // WIll using subdocuments
    },

    inventory: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    }],

    categories: [String],

    createAt: {
        type: Date,
        default: Date.now()
    }
});
