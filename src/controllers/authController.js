const User = require('../models/User');
const authService = require('../services/authService')
const {validationResult} = require('express-validator');

loginUser = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
        const result = await authService.login({email, password});
        res.status(201).json({token: result.token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

getInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        // console.log(req);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}
module.exports = {
    getInfo,
    loginUser
};