const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAddressSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
        required: true
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
    }
    // Additional fields like 'isPrimary', 'addressType', etc., can be added
});

const UserAddress = mongoose.model('UserAddress', userAddressSchema);
module.exports = UserAddress;
