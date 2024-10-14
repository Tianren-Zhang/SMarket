const mongoose = require('mongoose');
const validator = require('validator');
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

    mobilePhone: {
        type: String,
        required: [true, 'User phone number is required'],
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, 'any', {strictMode: false});
            },
            message: props => `${props.value} is not a valid phone number!`
        }
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
