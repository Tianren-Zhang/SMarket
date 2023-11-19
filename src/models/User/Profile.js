const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAddress'
    }],

    firstName: String,

    lastName: String,

    phoneNumber: String,

    profilePicture: String,

    dateOfBirth: Date,

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

});
// Pre-save hook to handle 'updatedAt'
ProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Pre-update hook to handle 'updatedAt'
ProfileSchema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
    this.set({updatedAt: Date.now()});
    next();
});

module.exports = mongoose.model('Profile', ProfileSchema);