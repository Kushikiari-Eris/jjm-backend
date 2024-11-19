const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required: true,
  },
  address: { 
    type: String, 
    required: true 
  },
  street: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  shippingLocation: {
    type: String,
    required: true
  },
  shippingFee: {
      type: Number,
      required: true,
      default: 0
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema)

module.exports = Address
