const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const Profile = require('../models/Profile');
const UserAddress = require('../models/UserAddress');
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
    const existingProfile = await Profile.findOne({user: userId, isDeleted: false})
        .populate('user', '-password -emailVerified')
        .populate({
            path: 'addresses',
            match: {isDeleted: false},
            select: '-isDeleted'
        });

    if (!existingProfile) {
        throw new Error('Profile not found');
    }

    if (existingProfile.addresses) {
        existingProfile.addresses = existingProfile.addresses.filter(address => address !== null);
    }

    return existingProfile;
};

const updateProfileByUserId = async (userId, profileData) => {
    // Find the existing profile
    const existingProfile = await Profile.findOne({user: userId, isDeleted: false});

    if (!existingProfile) {
        throw new Error('Profile not found');
    }

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
    ).populate('user', ['username', 'email']);

    return updatedProfile;
};

const addAddress = async (userId, addressData) => {
    // Update the profile
    const updatedProfile = await Profile.findOne({user: userId});
    const address = new UserAddress({user: userId, ...addressData});
    updatedProfile.addresses.push(address._id);
    await address.save();
    await updatedProfile.save();
    return updatedProfile;
};

const updateAddressById = async (userId, addressId, addressData) => {
    // Update the profile
    const updatedProfile = await Profile.findOne({user: userId});
    if (!updatedProfile) {
        throw new NotFoundError('User profile not found');
    }
    if (!updatedProfile.addresses.includes(addressId)) {
        throw new NotFoundError('Address not found');
    }

    const address = await UserAddress.findById(addressId);
    if (!address) {
        throw new NotFoundError('Address not found');
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
    const profile = await Profile.findOne({user: userId});
    if (!profile) {
        throw new NotFoundError('User profile not found');
    }
    if (!profile.addresses.includes(addressId)) {
        throw new NotFoundError('Address not found');
    }
    const address = await UserAddress.findById(addressId);
    if (!address) {
        throw new NotFoundError('Address not found');
    }
    address.isDeleted = true;
    // profile.addresses = profile.addresses.filter(id => id.toString() !== addressId);
    await address.save();
    await profile.save();
};

const deleteProfileByUserId = async (userId, userProfile) => {
    await Profile.findByIdAndUpdate(userProfile._id, {$unset: {isDelete: true}});

    // Update the user's profile reference
    await User.findByIdAndUpdate(userId, {$unset: {profile: ""}});
};

module.exports = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    addAddress,
    updateAddressById,
    deleteAddressById,
    deleteProfileByUserId
};
