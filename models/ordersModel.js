const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    street: {
        type: String,
        required: true,
    },
    zipCode: { 
        type: String 
    },
    paymentMethod: {
        type: String,
        default: 'cod',
        required: true
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }, 
            productName: { type: String, required: true },
            productQuantity: { type: Number, required: true },
            price: { type: Number, required: true },
            size: { type: String, required: true },
            image: { type: String }
        }
    ],
    totalAmount: { 
        type: Number, 
        required: true 
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
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
});

module.exports = mongoose.model('Order', orderSchema);
