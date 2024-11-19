
const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
    size: {
        type: String,
        enum: ['small', 'medium', 'large'], 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    status: { 
        type: String, 
        enum: ['InStock', 'LowOnStock', 'OutOfStock'], 
        default: 'InStock',
    }
});

// Middleware to automatically update status based on stock level
priceSchema.pre('save', function(next) {
    if (this.stock === 0) {
        this.status = 'OutOfStock';
    } else if (this.stock < 20) {
        this.status = 'LowOnStock';
    } else {
        this.status = 'InStock';
    }
    next();
});

const finishProductSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['soap', 'detergent'], 
        required: true,
    },
    unitPrize: [priceSchema], 
    location: {
        type: String,
        required: true,
    },
    launchStatus: { 
        type: String, 
        enum: ['Launched', 'Disable', 'pending'], 
        default: 'pending' 
    },
}, { timestamps: true });



const FinishProduct = mongoose.model('FinishProduct', finishProductSchema);
module.exports = FinishProduct;
