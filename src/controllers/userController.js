const userService = require('../services/userService');
const {validationResult} = require('express-validator');

exports.register = async (req, res) => {
    const {username, email, password, Role} = req.body;

    try {
        const token = await userService.register({username, email, password, Role});
        // Send the token to the client
        res.status(201).json({token});
    } catch (err) {
        console.error(err.message);
        res.status(err.status || 500).send(err.message || 'Server Error');
    }
};
