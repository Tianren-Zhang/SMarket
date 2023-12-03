const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAddressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    addressLine1: {
        type: String,
        required: true
    },

    addressLine2: String,
    city: {
        type: String,
    },

    state: {
        type: String,
        required: true
    },

    zipCode: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    isPrimary: {
        type: Boolean,
        required: true,
        default: false
    },

    addressType: {
        type: String
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
});

const UserAddress = mongoose.model('UserAddress', userAddressSchema);
module.exports = UserAddress;
