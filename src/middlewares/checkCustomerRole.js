const User = require('../models/User');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

const checkCustomerRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('userRole');

        if (!user || user.userRole.name !== 'Customer') {
            throw new UnauthorizedError('User is not authorized to perform this action');
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkCustomerRole;
