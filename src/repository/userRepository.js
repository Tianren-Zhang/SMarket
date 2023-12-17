const User = require("../models/User");

const findUserById = async (userId) => {
    return User.findById(userId);
}

module.exports = {
    findUserById,
}