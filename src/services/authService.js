const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const login = async ({email, password}) => {
    let user = await User.findOne({email});
    if (!user) {
        throw new UnauthorizedError('Invalid Credentials', 'email', email, 'body');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid Credentials', 'password', password, 'body');

    }

    const payload = {user: {id: user.id}};

    if (!process.env.JWT_SECRET) {
        throw new NotFoundError('JWT Secret is not defined');
    }

    // Sign the JWT and return the token
    const token = await new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRATION || '5h'},
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
    return {token};
};

module.exports = {
    login
};