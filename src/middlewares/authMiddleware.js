const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    throw new UnauthorizedError('Token is not valid', 'token', token, 'header');
  }
};
