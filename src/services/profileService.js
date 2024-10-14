const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const userRepository = require('../repository/userRepository');
const profileRepository = require('../repository/profileRepository');
const userAddressRepository = require('../repository/userAddressRepository');
const { validateProfile } = require('../validation/profileValidation');
const Profile = require('../models/Profile');
const UserAddress = require('../models/UserAddress');
const User = require('../models/User');

const createProfile = async (userId, profileData) => {
  // Check if the user exists
  const user = await userRepository.findUserById(userId);
  // Check if profile already exists
  const existingProfile = await Profile.findOne({
    user: userId,
    isDeleted: false,
  });
  if (existingProfile) {
    throw new AlreadyExistsError(
      'Profile already exists',
      'user',
      userId,
      'header'
    );
  }

  // Create and save the profile
  const profile = profileRepository.createProfile(userId, profileData);
  // console.log("profile created");
  user.profile = profile._id;
  await user.save();
  delete profile.isDeleted;
  return profile;
};

const getProfileByUserId = async (userId) => {
  const user = await userRepository.findUserById(userId);
  const existingProfile = await Profile.findOne({
    user: userId,
    isDeleted: false,
  })
    .populate('user', '-password -emailVerified')
    .populate({
      path: 'addresses',
      match: { isDeleted: false },
      select: '-isDeleted',
    })
    .select('-isDeleted');

  if (!existingProfile) {
    throw new NotFoundError('Profile not found', 'user', userId, 'header');
  }

  if (existingProfile.addresses) {
    existingProfile.addresses = existingProfile.addresses.filter(
      (address) => address !== null
    );
  }

  return existingProfile;
};

const updateProfileByUserId = async (userId, profileData) => {
  const { user, existingProfile } = await validateProfile(userId);

  // Merge socialMedia data if it exists in profileData

  if (
    profileData &&
    profileData.socialMedia &&
    existingProfile &&
    existingProfile.socialMedia
  ) {
    profileData.socialMedia = {
      ...existingProfile.socialMedia.toObject(), // Spread existing socialMedia
      ...profileData.socialMedia, // Overwrite with new values
    };
  } else if (profileData && profileData.socialMedia) {
    // Handle case where existingProfile.socialMedia is undefined
    profileData.socialMedia = {
      ...profileData.socialMedia,
    };
  }

  // Update the profile with merged data
  return await profileRepository.updateProfileById(userId, profileData);
};

const addAddress = async (userId, addressData) => {
  const { user, profile } = await validateProfile(userId);
  const address = await userAddressRepository.createUserAddress(
    userId,
    addressData
  );

  if (!Array.isArray(profile.addresses)) {
    profile.addresses = [];
  }
  profile.addresses.push(address._id);
  await profile.save();

  return profile;
};

const updateAddressById = async (userId, addressId, addressData) => {
  const { user, profile } = await validateProfile(userId);

  if (!profile.addresses.map((id) => id.toString()).includes(addressId)) {
    throw new NotFoundError(
      'Address not found here',
      'address',
      addressId,
      'params'
    );
  }

  await userAddressRepository.updateUserAddressById(addressId, addressData);

  return profile;
};

const deleteAddressById = async (userId, addressId) => {
  const { user, profile } = await validateProfile(userId);
  if (!profile.addresses.includes(addressId)) {
    throw new NotFoundError(
      'Address not found',
      'address',
      addressId,
      'params'
    );
  }
  await userAddressRepository.deleteUserAddressById(addressId);
  await profile.save();
};

const deleteProfileByUserId = async (userId) => {
  const { user, profile } = await validateProfile(userId);
  profile.isDeleted = true;
  await profile.save();
};

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfileByUserId,
  addAddress,
  updateAddressById,
  deleteAddressById,
  deleteProfileByUserId,
};
