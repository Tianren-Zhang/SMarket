const UserService = require('../services/UserService');
const {validationResult} = require('express-validator');

exports.register = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Extract details from the request body
    const {username, email, password} = req.body;

    try {
        const token = await UserService.register({username, email, password});
        res.status(201).json({token}); // Send the token to the client
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
