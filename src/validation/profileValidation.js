const userRepository = require('../repository/userRepository');
const User = require("../models/User");
const NotFoundError = require("../exceptions/NotFoundError");
const Profile = require("../models/Profile");

const validateProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        throw new NotFoundError('User not found', 'user', userId, 'header');
    }

    // Find the existing profile
    const profile = await Profile.findOne({user: userId, isDeleted: false}).select('-isDeleted');

    if (!profile) {
        throw new NotFoundError('Profile not found', 'user', userId, 'header');
    }
    return {user, profile};
}

module.exports = {validateProfile};