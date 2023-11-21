const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const Profile = require('../models/User/Profile');
const User = require("../models/User/User");

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
    const profile = await Profile.findOne({user: userId}).populate('user', ['username', 'email']);
    if (!profile) {
        throw new NotFoundError('Profile not found');
    }

    return profile;
};

const updateProfileByUserId = async (userId, profileData) => {
    // Check if profile exists
    const existingProfile = await Profile.findOne({user: userId});
    if (!existingProfile) {
        throw new NotFoundError('Profile not found');
    }

    // Update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
        {user: userId},
        {$set: profileData},
        {new: true}
    ).populate('user', ['username', 'email']);

    return updatedProfile;
};

const deleteProfileByUserId = async (userId) => {
    // Check if profile exists
    const profile = await Profile.findOne({user: userId});
    if (!profile) {
        throw new NotFoundError('Profile not found');
    }

    // Delete the profile
    await Profile.findByIdAndDelete(profile._id);

    // Update the user's profile reference
    await User.findByIdAndUpdate(userId, {$unset: {profile: ""}});
};

module.exports = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    deleteProfileByUserId
};
