const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    description: String,
    inventory: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
});
