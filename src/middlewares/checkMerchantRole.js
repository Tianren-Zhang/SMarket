const User = require('../models/User');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

const checkMerchantRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('userRole');

        if (!user || user.userRole.name !== 'Merchant') {
            throw new UnauthorizedError('User is not authorized to perform this action');
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkMerchantRole;
