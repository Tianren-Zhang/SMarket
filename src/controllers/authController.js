const User = require('../models/User');
const authService = require('../services/authService');
const { validationResult } = require('express-validator');

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login({ email, password });
    res.status(201).json({ token: result.token });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.getInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('store')
      .populate('shoppingCart');
    // console.log(req);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};
