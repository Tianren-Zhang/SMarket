const userService = require('../services/userService');
const {validationResult} = require('express-validator');

exports.register = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Extract details from the request body
    const {username, email, password, Role} = req.body;

    try {
        const token = await userService.register({username, email, password, Role});
        // Send the token to the client
        res.status(201).json({token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
