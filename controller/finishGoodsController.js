const FinishProduct = require('../models/finishGoodsModels');

// Function to determine status based on stock level
const determineStatus = (unitPrices) => {
    return unitPrices.map((item) => {
        const stock = parseInt(item.stock, 10);
        let status;
        if (stock === 0) {
            status = 'OutOfStock';
        } else if (stock < 20) {
            status = 'LowOnStock';
        } else {
            status = 'InStock';
        }
        return { ...item, status };
    });
};


// Function to add a finish product
const addFinishProduct = async (req, res) => {
    try {
        // Destructure expected fields from req.body
        const { productName, category, description, location, unitPrices } = req.body;
        const image = req.file ? req.file.filename : null;

        // Input validation
        if (!productName || !category || !description || !location || !unitPrices || unitPrices.length === 0) {
            return res.status(400).json({ message: 'All fields are required, including size prices.' });
        }

        // Parse the unitPrices array from the request
        const parsedUnitPrices = JSON.parse(unitPrices); // Ensure unitPrices is parsed correctly

        // Determine status based on stock
        const unitPricesWithStatus = determineStatus(parsedUnitPrices);

        // Create a new instance of FinishProduct
        const newFinishGoods = new FinishProduct({
            productName,
            description,
            category,
            location,
            unitPrize: unitPricesWithStatus, // Use the updated unitPrices with status
            image: image ? `${image}` : null,
        });

        // Save the new product to the database
        await newFinishGoods.save();
        
        // Respond with success message and the new product
        res.status(201).json({ message: "Finish Goods added successfully", product: newFinishGoods });

    } catch (error) {
        console.error('Error adding finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Function to show all finish products
const showAllFinishProducts = async (req, res) => {
    try {
        const products = await FinishProduct.find(); // Fetch all products from the database
        res.status(200).json(products); // Respond with the list of products
    } catch (error) {
        console.error('Error fetching finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const showOnlyFinishProducts = async (req, res) => {
    try {
        const productId = req.params.id

        const product = await FinishProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json({ product })
    } catch (error) {
        console.error("Error retrieving product:", error)
        res.status(500).json({ message: "Server error" })
    }
};

const editFinishProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the URL parameters
    try {
        // Destructure expected fields from req.body
        const { productName, category, description, location, unitPrices } = req.body;
        const image = req.file ? req.file.filename : null; // Handle the image file if present

        // Input validation
        if (!productName || !category || !description || !location || !unitPrices || unitPrices.length === 0) {
            return res.status(400).json({ message: 'All fields are required, including size prices.' });
        }

        // Parse the unitPrices array from the request
        const parsedUnitPrices = JSON.parse(unitPrices); // Ensure unitPrices is parsed correctly

        // Determine status based on stock
        const unitPricesWithStatus = determineStatus(parsedUnitPrices);

        // Find the product by ID and update it
        const updatedProduct = await FinishProduct.findByIdAndUpdate(
            id,
            {
                productName,
                description,
                category,
                location,
                unitPrize: unitPricesWithStatus, // Use the updated unitPrices with status
                image: image ? `${image}` : undefined, // Update image if present, otherwise leave unchanged
            },
            { new: true } // Option to return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Respond with success message and the updated product
        res.status(200).json({ message: "Finish Goods updated successfully", product: updatedProduct });

    } catch (error) {
        console.error('Error updating finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const editLaunchStatus = async (req, res) => {
    const { id } = req.params;  // Extract productId from route parameters
    const { launchStatus } = req.body;  // Extract new launch status from request body
    
    try {
        // Validate that the launch status is valid (e.g., "Launched" or "Disabled")
        if (!['Launched', 'Disabled'].includes(launchStatus)) {
            return res.status(400).json({ message: 'Invalid launch status value' });
        }

        // Find the product by its ID and update the launchStatus
        const updatedProduct = await FinishProduct.findByIdAndUpdate(
            id,
            { launchStatus },
            { new: true } // Return the updated product document
        );

        // If product not found
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Respond with the updated product
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating launch status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const deleteFinishProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the URL parameters
    try {
        const deletedProduct = await FinishProduct.findByIdAndDelete(id); // Delete the product by ID

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Respond with success message
        res.status(200).json({ message: "Finish Goods deleted successfully", product: deletedProduct });

    } catch (error) {
        console.error('Error deleting finish goods:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const lowOnStockAlerts = async (req,res) => {
    try {
        const lowStockProducts = await FinishProduct.find({
          'unitPrize.status': { $in: ['LowOnStock', 'OutOfStock'] },
        }).select('productName unitPrize');
    
        
        const alerts = lowStockProducts.flatMap(product =>
          product.unitPrize
            .filter(prize => prize.status !== 'InStock')
            .map(prize => ({
              productId: product._id,
              productName: product.productName,
              size: prize.size,
              stock: prize.stock,
              status: prize.status,
            }))
        );
    
        res.json(alerts);
      } catch (error) {
        console.error('Error fetching low stock products:', error);
        res.status(500).json({ error: 'Failed to fetch low stock products' });
      }
}

const decrementStock = async (req, res) => {
    const { size, quantity } = req.body; // Ensure these fields are being destructured
    const { id } = req.params;

    console.log('Updating stock for:', id, req.body); // Log incoming request

    if (!size || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid size or quantity provided' });
    }

    try {
        const product = await FinishProduct.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!Array.isArray(product.unitPrize)) { // Ensure `unitPrize` is an array of size data
            return res.status(400).json({ message: 'Invalid product sizes data structure' });
        }

        const sizeInfo = product.unitPrize.find(s => s.size === size);
        if (!sizeInfo) {
            return res.status(400).json({ message: `Size '${size}' not found` });
        }

        if (sizeInfo.stock < quantity) {
            return res.status(400).json({ message: `Insufficient stock for size '${size}'` });
        }

        // Decrement stock
        sizeInfo.stock -= quantity;
        await product.save();

        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};










module.exports = {
    addFinishProduct,
    showAllFinishProducts,
    editFinishProduct,
    deleteFinishProduct,
    showOnlyFinishProducts,
    editLaunchStatus,
    lowOnStockAlerts,
    decrementStock
};
