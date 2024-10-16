const UserAddress = require('../../models/UserAddress');
const NotFoundError = require('../../exceptions/NotFoundError');

const findUserAddressById = async (addressId) => {
  const address = await UserAddress.findById(addressId);
  console.log(address);
  if (!address || address.isDeleted) {
    throw new NotFoundError(
      'Address not found',
      'address',
      addressId,
      'params'
    );
  }
  return address;
};

const createUserAddress = async (userId, addressData) => {
  const userAddress = new UserAddress({ user: userId, ...addressData });
  await userAddress.save();

  return userAddress.toObject();
};

const updateUserAddressById = async (addressId, addressData) => {
  const address = await findUserAddressById(addressId);

  for (const key in addressData) {
    if (addressData.hasOwnProperty(key)) {
      address[key] = addressData[key];
    }
  }
  await address.save();
};
const deleteUserAddressById = async (addressId) => {
  const address = await UserAddress.findById(addressId);
  if (!address || address.isDeleted) {
    throw new NotFoundError(
      'Address not found',
      'address',
      addressId,
      'params'
    );
  }
  address.isDeleted = true;
  // profile.addresses = profile.addresses.filter(id => id.toString() !== addressId);
  await address.save();
};

module.exports = {
  findUserAddressById,
  createUserAddress,
  updateUserAddressById,
  deleteUserAddressById,
};
