const mongoose = require('mongoose')


const priceSchema = mongoose.Schema({
    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});


const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['soap', 'detergent'],
        required: true,
    },
    prices: [priceSchema],
    image: { 
        type: String 
    },
})

const Product = mongoose.model('product', productSchema)
module.exports = Product