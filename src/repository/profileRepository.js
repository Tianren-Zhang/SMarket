const Profile = require('../models/Profile');
const NotFoundError = require('../exceptions/notFoundError');

const findProfileById = async (profileId) => {
    const profile = await Profile.findById(profileId);
    if (!profile || profile.isDeleted) {
        throw new NotFoundError('Profile not found', 'profileId', profileId, 'params');
    }
    return profile;
};

const createProfile = async (userId, profileData) => {
    // console.log("creating profile");
    const profile = new Profile({
        user: userId,
        addresses: [],
        ...profileData
    });
    await profile.save();

    return profile.toObject();
};

const updateProfileById = async (userId, profileData) => {
    return Profile.findOneAndUpdate(
        {user: userId},
        {$set: profileData},
        {new: true}
    ).populate('user', ['username', 'email'])
        .select('-isDeleted');
};

module.exports = {
    findProfileById,
    createProfile,
    updateProfileById,
};