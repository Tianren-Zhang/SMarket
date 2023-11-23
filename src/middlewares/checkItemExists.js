const Item = require('../models/Item'); // Assuming Item model is correctly set up
const NotFoundError = require('../exceptions/NotFoundError');

const checkItemExists = async (req, res, next) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);

        if (!item) {
            throw new NotFoundError('Item not found');
        }

        req.item = item;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkItemExists;
