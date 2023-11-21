const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
    // Additional fields
});

const UserRole = mongoose.model('UserRole', userRoleSchema);
module.exports = UserRole;
