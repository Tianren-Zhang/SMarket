const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Check if not token
    if (!token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err);
        throw new UnauthorizedError('Token is not valid', 'token', token, 'header');
    }
};
