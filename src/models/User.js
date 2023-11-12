const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        enum: ['buyer', 'merchant'],
        default: 'buyer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profile: {
        // Shared profile fields
        firstName: String,
        lastName: String,
        phoneNumber: String,
        address: String,
        // ... other common fields
    },
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
    shoppingCart: {
        // Fields specific to buyers
        items: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item'
            },
            quantity: Number
        }],
        // ... other buyer-specific fields
    },
    // ... other fields as necessary
});

module.exports = mongoose.model('User', UserSchema);
