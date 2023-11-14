const User = require('../models/User/User');
const authService = require('../services/authService')

loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const token = authService.login({email, password});
        res.status(201).json({token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

getInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
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