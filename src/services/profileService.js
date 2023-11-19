const Profile = require('../models/User/Profile');
const User = require("../models/User/User");

const createProfile = async (userId, profileData) => {
    const existingProfile = await Profile.findOne({user: userId});
    if (existingProfile) {
        throw new Error('Profile already exists');
    }


    const profile = new Profile({user: userId, ...profileData});
    return await profile.save();
};

const getProfileByUserId = async (userId) => {
    const profile = Profile.findOne({user: userId}).populate('user', ['username', 'email']);
    if (!profile) {
        throw new Error('Profile not found');
    }
    return profile;
};

const updateProfileByUserId = async (userId, profileData) => {
    return Profile.findOneAndUpdate(
        {user: userId},
        {$set: profileData},
        {new: true, upsert: true}
    ).populate('user', ['username', 'email']);
};

const deleteProfileByUserId = async (userId) => {
    const profile = await Profile.findOne({user: userId});
    if (profile) {
        await Profile.findByIdAndDelete(profile._id);
    }
    await User.findByIdAndUpdate(userId, {profile: null});
};

module.exports = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    deleteProfileByUserId
};
