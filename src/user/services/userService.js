const AlreadyExistsError = require('../../exceptions/AlreadyExistsError');
const NotFoundError = require('../../exceptions/NotFoundError');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRole = require('../../models/UserRole');
const ShoppingCart = require('../../models/ShoppingCart');

const register = async ({ username, email, password, Role }) => {
  // Check if a user with the given email already exists
  let user = await User.findOne({ email });
  if (user) {
    throw new AlreadyExistsError('User already exists', 'email', email, 'body');
  }
  const role = await UserRole.findOne({ name: Role });
  if (!role) {
    throw new NotFoundError('Role not found', 'UserRole', Role, 'body');
  }

  // Create a new user instance
  user = new User({
    username,
    email,
    password,
    userRole: [role._id],
  });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  if (Role === 'Customer') {
    const emptyCart = new ShoppingCart({
      user: user._id,
      items: [], // An empty array, indicating an empty cart
    });
    await emptyCart.save();

    // Link the empty cart to the user
    user.shoppingCart = emptyCart._id;
    await user.save();
  }

  // Prepare the JWT payload
  const payload = {
    user: {
      id: user.id,
    },
  };

  // Sign the JWT and return the token
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });

  return token;
};

module.exports = {
  register,
};
