const profileService = require('../services/profileService');
const User = require('../models/User/User');
const {validationResult} = require('express-validator');

exports.createProfile = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const profile = await profileService.createProfile(req.user.id, req.body);
        await User.findByIdAndUpdate(req.user.id, {profile: profile._id});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCurrentProfile = async (req, res) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);
        if (!profile) {
            return res.status(404).json({msg: 'Profile not found'});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const profile = await profileService.updateProfileByUserId(req.user.id, req.body);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await profileService.deleteProfileByUserId(req.user.id);
        res.json({msg: 'Profile deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
