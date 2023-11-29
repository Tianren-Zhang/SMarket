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

    emailVerified: {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: true
    },

    userRole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRole'
    },

    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },

    store: [{
        type: Schema.Types.ObjectId,
        ref: 'Store',
    }],

    shoppingCart: [{
        type: Schema.Types.ObjectId,
        ref: 'ShoppingCart',
    }],
    // other fields
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);
