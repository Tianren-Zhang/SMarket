const rateLimit = require('express-rate-limit');
const TooManyRequestsError = require('../exceptions/TooManyRequestsError');

// General purpose API rate limiter
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP up to 100 requests per windowMs
  handler: function (req, res, next) {
    next(
      new TooManyRequestsError(
        'Too many requests from this IP, please try again later'
      )
    );
  },
});

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  handler: function (req, res, next) {
    next(
      new TooManyRequestsError(
        'Too many login attempts from this IP, please try again after 15 minutes'
      )
    );
  },
});

module.exports = {
  apiRateLimiter,
  loginRateLimiter,
};
