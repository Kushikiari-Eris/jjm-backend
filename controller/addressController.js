const Address = require('../models/addressModels');
const User = require('../models/userModel'); 

// Create a new address
const createAddress = async (req, res) => {
  try {
    const { userId, name, street, address, phone, shippingLocation, shippingFee, zipCode, isDefault } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new address
    const newAddress = new Address({
      user: userId,
      street,
      name,
      phone,
      address,
      zipCode,
      shippingLocation,
      shippingFee,
      isDefault,
    });

    // Save the address
    const addresses = await newAddress.save();
    res.status(201).json({ message: 'Address created successfully', addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all addresses for the user
    const addresses = await Address.find({ user: userId });
    if (!addresses || addresses.length === 0) {
      return res.status(404).json({ message: 'No addresses found for this user' });
    }
    
    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing address
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { street, name, phone, address, shippingLocation, shippingFee, zipCode, isDefault } = req.body;

    // Find the address and update it
    const addresses = await Address.findByIdAndUpdate(
      addressId,
      { street, name, phone, address, shippingLocation, shippingFee, zipCode, isDefault },
      { new: true }
    );

    if (!addresses) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address updated successfully', addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Find and delete the address
    const address = await Address.findByIdAndDelete(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set an address as the default for a user
const setDefaultAddress = async (req, res) => {
  const { addressId, userId } = req.body;

  try {
    // Unset any previous default address for this user
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });

    // Set the new default address
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );

    res.status(200).json({ message: 'Default address updated successfully', address: updatedAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
