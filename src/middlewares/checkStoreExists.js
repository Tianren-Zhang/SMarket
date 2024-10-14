const Store = require('../models/Store');
const NotFoundError = require('../exceptions/NotFoundError');

const checkStoreExists = async (req, res, next) => {
  try {
    //console.log("Checking if store exists");

    const storeId = req.params.storeId;
    //console.log(storeId);
    const store = await Store.findById(storeId);

    if (!store) {
      throw new NotFoundError('Store not found');
    }

    req.store = store; // Add store to the request object for use in the next middleware or controller
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkStoreExists;
