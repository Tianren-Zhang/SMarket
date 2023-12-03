const profileService = require('../services/profileService');
const User = require('../models/User');
const {validationResult} = require('express-validator');

exports.createProfile = async (req, res) => {
    try {
        const profile = await profileService.createProfile(req.user.id, req.body);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getCurrentProfile = async (req, res) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profile = await profileService.updateProfileByUserId(req.user.id, req.body);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.addAddress = async (req, res) => {
    try {
        const profile = await profileService.addAddress(req.user.id, req.body);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.updateAddress = async (req, res) => {
    try {
        console.log(req.params.addressId);
        const profile = await profileService.updateAddressById(req.user.id, req.params.addressId, req.body);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        await profileService.deleteAddressById(req.user.id, req.params.addressId);
        res.json({msg: 'Address deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await profileService.deleteProfileByUserId(req.user.id, req.user.profile);
        res.json({msg: 'Profile deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};
