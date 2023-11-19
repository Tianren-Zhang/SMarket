const User = require('../models/User/User');
const authService = require('../services/authService')

loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await authService.login({email, password});
        if (result.error) {
            return res.status(400).json({msg: result.error});
        }
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