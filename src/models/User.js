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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        unique: true
    },

    store: [{
        type: Schema.Types.ObjectId,
        ref: 'Store',
        unique: true
    }],

    shoppingCart: [{
        type: Schema.Types.ObjectId,
        ref: 'ShoppingCart',
        unique: true
    }],
    // other fields
});

module.exports = mongoose.model('User', UserSchema);
