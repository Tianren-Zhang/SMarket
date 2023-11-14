const User = require('../models/User/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async ({username, email, password}) => {
    // Check if a user with the given email already exists
    let user = await User.findOne({email});
    if (user) {
        throw new Error('User already exists');
    }

    // Create a new user instance
    user = new User({
        username,
        email,
        password
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Prepare the JWT payload
    const payload = {
        user: {
            id: user.id
        }
    };

    // Sign the JWT and return the token
    const token = await new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '5h'},
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });

    return token;
};

module.exports = {
    register
};
