const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRole'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profile: {

        firstName: String,
        lastName: String,
        phoneNumber: String,
        address: String,
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAddress'
    }],
    store: {
        // Fields specific to merchants
        storeName: String,
        description: String,
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }],
        // ... other merchant-specific fields
    },

    shoppingCart: [{
        type: Schema.Types.ObjectId,
        ref: 'ShoppingCart'
    }],
    // ... other fields as necessary
});

module.exports = mongoose.model('User', UserSchema);
