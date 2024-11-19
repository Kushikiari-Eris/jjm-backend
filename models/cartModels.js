const mongoose = require('mongoose')

const cartSchema =  mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FinishProduct',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure quantity is at least 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0, // Ensure total price is non-negative
    },
    image: {
        type: String,
    },
    size: { type: String, required: true },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});


const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart