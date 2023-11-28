const UnauthorizedError = require('../exceptions/UnauthorizedError');
const NotFoundError = require('../exceptions/NotFoundError');
const AlreadyExistsError = require('../exceptions/AlreadyExistsError');
const Store = require('../models/Store');
const Item = require('../models/Item');
const User = require("../models/User");

const createStore = async (ownerId, storeData) => {
    const owner = await User.findById(ownerId).populate('userRole');

    const store = new Store({owner: ownerId, ...storeData});
    await store.save();

    owner.store.push(store._id);
    await owner.save();
    return store;
};

const updateStore = async (storeId, userId, updateData) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found');
    }

    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized User');
    }

    return Store.findOneAndUpdate(
        {owner: store.owner},
        {$set: updateData},
        {new: true, upsert: true}
    ).populate('owner', ['username', 'email']);
};

const getStoreInfo = async (storeId) => {
    const store = await Store.findById(storeId)
        .populate('inventory.item')
        .populate('owner', ['username', 'email']);
    if (!store) {
        throw new NotFoundError('Store not found');
    }
    return store;
};


const deleteStore = async (storeId, userId) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new NotFoundError('Store not found');
    }
    if (store.owner.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized User');
    }

    // console.log(store.owner);
    await Item.deleteMany({store: storeId});
    await Store.findByIdAndDelete(storeId);
    await User.findByIdAndUpdate(store.owner, {$pull: {store: storeId}});
};

const getStores = async () => {
    return Store.find().populate('owner', ['username', 'email']);
}

const getStoreById = async (storeId) => {
    const store = await Store.findById(storeId).populate('owner', ['username', 'email']);
    if (!store) {
        throw new NotFoundError('Store not found');
    }
    return store;
}

module.exports = {
    createStore,
    updateStore,
    getStoreInfo,
    deleteStore,
    getStores,
    getStoreById,

};
