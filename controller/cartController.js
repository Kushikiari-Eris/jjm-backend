const Cart = require('../models/cartModels')

const createCart = async (req, res) => {
    try {
        const { userId, productName, productId, totalPrice, quantity, image, size} = req.body

        if (!userId || !productName || !productId || !totalPrice || !quantity || !image || !size) {
            return res.status(400).json({ Message: "All fields are required" });
        }
        
        const cartItem = new Cart({
            userId,
            productName,
            productId,
            quantity,
            totalPrice,
            image,
            size,
        })

        await cartItem.save()
        res.status(201).json({ Message: "Added to Cart" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Failed to Add to Cart" })
    }
}

const showAllCart = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
    const options = {
        page: Number(page),
        limit: Number(limit)
    };

    try {
        const cartItems = await Cart.find().limit(options.limit).skip((options.page - 1) * options.limit);
        const totalItems = await Cart.countDocuments();
        
        res.status(200).json({
            totalItems,
            totalPages: Math.ceil(totalItems / options.limit),
            currentPage: options.page,
            cartItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: "Failed to fetch cart items" });
    }
};


const showCartByUser = async (req, res) => {
    const { userId } = req.params; // Expecting userId as a URL parameter

    try {
        const cartItems = await Cart.find({ userId }); // Retrieves cart items for the specific user
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: "Failed to fetch cart items for user" });
    }
}

const updateCartItem = async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity, totalPrice } = req.body;

    try {
        const updatedItem = await Cart.findOneAndUpdate(
            { userId, _id: productId },
            { quantity, totalPrice},
            { new: true } // Return the updated document
        );

        if (updatedItem) {
            return res.status(200).json(updatedItem);
        } else {
            return res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return res.status(500).json({ message: "Error updating quantity" });
    }
}

const deleteCartItem = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const result = await Cart.deleteOne({ userId, _id: productId }); // Ensure you use _id for the MongoDB document
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: "Item removed from cart" });
        } else {
            return res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return res.status(500).json({ message: "Error removing item" });
    }
}






module.exports = {
    createCart,
    showAllCart,
    showCartByUser,
    deleteCartItem,
    updateCartItem
}