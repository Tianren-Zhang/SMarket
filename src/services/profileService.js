const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const Profile = require('../models/Profile');
const User = require("../models/User");

const createProfile = async (userId, profileData) => {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({user: userId});
    if (existingProfile) {
        throw new AlreadyExistsError('Profile already exists');
    }

    // Create and save the profile
    const profile = new Profile({user: userId, ...profileData});
    await profile.save();

    // Link profile to the user
    user.profile = profile._id;
    await user.save();

    return profile;
};

const getProfileByUserId = async (userId) => {
    return Profile.findOne({user: userId}).populate('user', ['username', 'email']);
};

const updateProfileByUserId = async (userId, profileData) => {
    // Update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
        {user: userId},
        {$set: profileData},
        {new: true}
    ).populate('user', ['username', 'email']);

    return updatedProfile;
};

const deleteProfileByUserId = async (userId, userProfile) => {
    await Profile.findByIdAndDelete(userProfile._id);

    // Update the user's profile reference
    await User.findByIdAndUpdate(userId, {$unset: {profile: ""}});
};

module.exports = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    deleteProfileByUserId
};
