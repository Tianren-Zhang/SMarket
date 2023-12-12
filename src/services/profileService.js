const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const Profile = require('../models/Profile');
const UserAddress = require('../models/UserAddress');
const User = require("../models/User");

const createProfile = async (userId, profileData) => {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        throw new NotFoundError('User not found', 'user', userId, 'header');
    }
    // Check if profile already exists
    const existingProfile = await Profile.findOne({user: userId, isDeleted: false});
    if (existingProfile) {
        throw new AlreadyExistsError('Profile already exists', 'user', userId, 'header');
    }

    // Create and save the profile
    const profile = new Profile({user: userId, ...profileData});
    await profile.save();

    // Link profile to the user
    user.profile = profile._id;
    await user.save();

    const profileResponse = profile.toObject();
    delete profileResponse.isDeleted;
    return profileResponse;
};

const getProfileByUserId = async (userId) => {
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        throw new NotFoundError('User not found', 'user', userId, 'header');
    }
    const existingProfile = await Profile.findOne({user: userId, isDeleted: false})
        .populate('user', '-password -emailVerified')
        .populate({
            path: 'addresses',
            match: {isDeleted: false},
            select: '-isDeleted'
        })
        .select('-isDeleted');

    if (!existingProfile) {
        throw new NotFoundError('Profile not found', 'user', userId, 'header');
    }

    if (existingProfile.addresses) {
        existingProfile.addresses = existingProfile.addresses.filter(address => address !== null);
    }

    return existingProfile;
};

const updateProfileByUserId = async (userId, profileData) => {
    const {user, existingProfile} = await checkProfile(userId);

    // Merge socialMedia data if it exists in profileData
    if (profileData.socialMedia && existingProfile.socialMedia) {
        profileData.socialMedia = {
            ...existingProfile.socialMedia.toObject(), // Spread existing socialMedia
            ...profileData.socialMedia // Overwrite with new values
        };
    }

    // Update the profile with merged data
    const updatedProfile = await Profile.findOneAndUpdate(
        {user: userId},
        {$set: profileData},
        {new: true}
    ).populate('user', ['username', 'email'])
        .select('-isDeleted');

    return updatedProfile;
};

const addAddress = async (userId, addressData) => {
    const {user, updatedProfile} = await checkProfile(userId);

    const address = new UserAddress({user: userId, ...addressData});
    updatedProfile.addresses.push(address._id);
    await address.save();
    await updatedProfile.save();

    return updatedProfile;
};

const updateAddressById = async (userId, addressId, addressData) => {
    const {user, updatedProfile} = await checkProfile(userId);
    if (!updatedProfile.addresses.includes(addressId)) {
        throw new NotFoundError('Address not found', 'address', addressId, 'params');
    }

    const address = await UserAddress.findById(addressId);
    if (!address || address.isDeleted) {
        throw new NotFoundError('Address not found', 'address', addressId, 'params');
    }

    for (const key in addressData) {
        if (addressData.hasOwnProperty(key)) {
            address[key] = addressData[key];
        }
    }
    await address.save();

    return updatedProfile;
};

const deleteAddressById = async (userId, addressId) => {
    const {user, profile} = await checkProfile(userId);
    if (!profile.addresses.includes(addressId)) {
        throw new NotFoundError('Address not found', 'address', addressId, 'params');
    }
    const address = await UserAddress.findById(addressId);
    if (!address || address.isDeleted) {
        throw new NotFoundError('Address not found', 'address', addressId, 'params');
    }
    address.isDeleted = true;
    // profile.addresses = profile.addresses.filter(id => id.toString() !== addressId);
    await address.save();
    await profile.save();
};

const deleteProfileByUserId = async (userId) => {
    const {user, profile} = await checkProfile(userId);
    profile.isDeleted = true;
    await profile.save();
};

async function checkProfile(userId) {
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

module.exports = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    addAddress,
    updateAddressById,
    deleteAddressById,
    deleteProfileByUserId
};
