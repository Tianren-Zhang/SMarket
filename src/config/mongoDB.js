const mongoose = require('mongoose');
const UserRole = require('../models/User/UserRole');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

const createRoles = async () => {
    const roles = ["Merchant", "Customer"];

    for (let role of roles) {
        const roleExists = await UserRole.findOne({name: role});

        if (!roleExists) {
            await UserRole.create({name: role});
        }
    }
};


module.exports = {
    connectDB,
    createRoles
};
