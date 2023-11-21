const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressType = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
    // Additional fields
});

const UserRole = mongoose.model('AddressType', AddressType);
module.exports = UserRole;
