const User = require('../models/User');
const NotFoundError = require('../exceptions/NotFoundError');

const findUserById = async (userId) => {
  const user = User.findById(userId);
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found', 'userId', userId, 'header');
  }
  return user;
};

module.exports = {
  findUserById,
};
