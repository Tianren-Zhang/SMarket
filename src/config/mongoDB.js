const mongoose = require('mongoose');
const UserRole = require('../models/UserRole');
const Category = require('../models/Category');

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

const createUserRoles = async () => {
    const roles = ["Merchant", "Customer"];

    try {
        for (let role of roles) {
            const roleExists = await UserRole.findOne({name: role});

            if (!roleExists) {
                await UserRole.create({name: role});
            }
        }
        console.log('Roles created successfully');
    } catch (err) {
        console.error('Error creating roles:', err);
    }
};

const createCategories = async () => {
    const mainCategories = [
        'Mobile Phones', 'Pharmaceuticals', 'Food', 'Men\'s Clothing',
        'Women\'s Clothing', 'Lingerie', 'Footwear', 'Furniture',
        'Kitchenware', 'Beverages & Liquor', 'Computers & Office',
        'Digital Products', 'Skincare', 'Bags & Luggage'
    ];
    try {
        // Clear the categories collection
        // await Category.deleteMany({});

        for (const categoryName of mainCategories) {
            const category = new Category({name: categoryName});
            await category.save();
        }

        console.log('Categories initialized successfully');
    } catch (err) {
        console.error('Error initializing categories:', err);
    }
};

const initializeSubcategories = async () => {
    try {
        // Example subcategories for "Mobile Phones"
        const mobilePhoneSubCategories = [
            'Smartphones', 'Cases & Covers', 'Screen Protectors', 'Chargers',
            'Headphones', 'Memory Cards', 'Power Banks', 'Bluetooth Accessories',
            'Mounts & Stands', 'Parts & Tools'
        ];

        // Find the main category "Mobile Phones"
        const mobilePhoneCategory = await Category.findOne({name: 'Mobile Phones'});

        if (!mobilePhoneCategory) {
            throw new Error('Main category not found');
        }

        // Create subcategories
        for (const subCategoryName of mobilePhoneSubCategories) {
            const subCategory = new Category({
                name: subCategoryName,
                parentCategory: mobilePhoneCategory._id
            });
            await subCategory.save();
        }

        console.log('Subcategories for Mobile Phones initialized successfully');
    } catch (err) {
        console.error('Error initializing subcategories:', err);
    }
};

module.exports = {
    connectDB,
    createUserRoles,
    createCategories,
    initializeSubcategories,
};
