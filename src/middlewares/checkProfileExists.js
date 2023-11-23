const Profile = require('../models/Profile');
const NotFoundError = require('../exceptions/NotFoundError');

const checkUserExists = async (req, res, next) => {
    try {
        const userId = req.user.id; // Adjust based on your route parameter or authentication system
        const profile = await Profile.findOne({user: userId});

        if (!profile) {
            throw new NotFoundError('Profile not found');
        }
        req.user.profile = profile; // Add user to the request object
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkUserExists;
