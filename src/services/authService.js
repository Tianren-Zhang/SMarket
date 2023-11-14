const User = require("../models/User/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const login = async ({email, password}) => {
    // Check if a user with the given email is not exists
    let user = await User.findOne({email});
    if (user) {
        throw new Error('Invalid Credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }

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
    login
};