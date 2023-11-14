const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Profile = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: String,
    lastName: String,
    phoneNumber: String,
});
module.exports = mongoose.model('Profile', Profile);