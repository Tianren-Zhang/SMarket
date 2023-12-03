const User = require('../models/User');
const authService = require('../services/authService')
const {validationResult} = require('express-validator');

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await authService.login({email, password});
        res.status(201).json({token: result.token});
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};

exports.getInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('store').populate('shoppingCart');
        // console.log(req);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
}
