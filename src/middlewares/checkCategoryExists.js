const Category = require('../models/Category');

const checkCategoryExists = async (req, res, next) => {
    try {
        const categoryId = req.body.category; // Assuming the category ID is sent in the request body
        if (!categoryId) {
            return res.status(400).json({msg: 'Category ID is required.'});
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({msg: 'Category not found.'});
        }

        next(); // Proceed to the next middleware or controller function
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

module.exports = checkCategoryExists;