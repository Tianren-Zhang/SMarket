const profileService = require('../services/profileService');
const User = require('../../models/User');
const { validationResult } = require('express-validator');

exports.createProfile = async (req, res, next) => {
  try {
    const profile = await profileService.createProfile(req.user.id, req.body);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.getCurrentProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user.id);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfileByUserId(
      req.user.id,
      req.body
    );
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const profile = await profileService.addAddress(req.user.id, req.body);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    // console.log(req.params.addressId);
    const profile = await profileService.updateAddressById(
      req.user.id,
      req.params.addressId,
      req.body
    );
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    await profileService.deleteAddressById(req.user.id, req.params.addressId);
    res.json({ msg: 'Address deleted' });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await profileService.deleteProfileByUserId(req.user.id);
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};
