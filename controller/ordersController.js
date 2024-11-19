const Order = require('../models/ordersModel')
const FinishProduct = require('../models/finishGoodsModels')

const orders = async (req, res) => {
    try {
        const { userId, name, address, contactNumber, paymentMethod, zipCode, items, street, totalAmount, shippingLocation, shippingFee } = req.body;

        // Create the new order without modifying stock
        const newOrder = new Order({
            userId,
            customerName: name,
            address,
            contactNumber,
            paymentMethod,
            street,
            zipCode,
            items,
            totalAmount,
            shippingLocation,
            shippingFee,
            orderDate: new Date(),
            status: 'Pending', // Initially set to 'Pending'
        });

        // Save the new order
        await newOrder.save();

        // Respond with the newly created order
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};


const showAllOrders = async (req, res) => {
    // Fetch all orders from the database
    Order.find({})
        .then(orders => res.json(orders))
        .catch(err => res.status(500).json({ message: 'Error fetching orders' }));
}

// Get orders by user ID
const showOrdersByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userOrders = await Order.find({ userId }); // Query the database

        if (userOrders.length === 0) {
            // Return 200 OK even if no orders found (empty array)
            return res.status(200).json(userOrders);
        } else {
            return res.status(200).json(userOrders); // Return the orders
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Failed to fetch orders' });
    }
}


const showOrderById = async (req, res) => {
    const orderId = req.params.id; // Assuming the ID is passed as a route parameter
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'Failed to fetch order' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    
    // Check if the status is a valid option
    if (!['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status; // Update status
        await order.save();
        
        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

const confirmOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Update the order status to 'Confirmed'
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: 'Confirmed' },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Array to store bulk product updates
        const bulkOperations = [];

        for (const item of order.items) {
            // Find the product by ID
            const product = await FinishProduct.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productName}` });
            }

            const sizeEntry = product.unitPrize.find((entry) => entry.size === item.size);
            if (!sizeEntry) {
                return res.status(404).json({ message: `Size not found for product: ${item.productName}` });
            }

            // Check stock availability
            if (sizeEntry.stock < item.productQuantity) {
                return res
                    .status(400)
                    .json({ message: `Insufficient stock for ${item.productName} (${item.size})` });
            }

            // Update stock and status
            sizeEntry.stock -= item.productQuantity;
            sizeEntry.status =
                sizeEntry.stock === 0
                    ? 'OutOfStock'
                    : sizeEntry.stock < 20
                    ? 'LowOnStock'
                    : 'InStock';

            // Prepare bulk update operation
            bulkOperations.push({
                updateOne: {
                    filter: { _id: product._id, 'unitPrize._id': sizeEntry._id },
                    update: {
                        $set: {
                            'unitPrize.$.stock': sizeEntry.stock,
                            'unitPrize.$.status': sizeEntry.status,
                        },
                    },
                },
            });
        }

        // Execute bulk updates for all products
        if (bulkOperations.length > 0) {
            await FinishProduct.bulkWrite(bulkOperations);
        }

        // Respond with the updated order
        res.status(200).json({ message: 'Order confirmed', order });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ message: 'Error confirming order', error: error.message });
    }
};

const cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order can be cancelled
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        // Update the order status to "Cancelled"
        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Error cancelling order', error: error.message });
    }
};








module.exports = {
    orders,
    showAllOrders,
    showOrdersByUser,
    showOrderById,
    updateOrderStatus,
    confirmOrder,
    cancelOrder
}