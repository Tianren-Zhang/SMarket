const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    // Additional fields like category, images, specifications, etc.
});
