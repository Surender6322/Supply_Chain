const db = require('../db/index')
const Inventory = db.inventory;
const Order = db.order;

// Endpoint to create an order
const createOrder = async (req, res) => {

    if (!req.user) {
        return res.status(400).json({ error: 'please authenticate' });
    }
    try {

        const { order_date, item_code, item_name, quantity } = req.body;

        user_id = req.user.id;
        // Check if the quantity in the order is greater than 0
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity in the order' });
        }

        // Calculate total value based on item's price from inventory
        const totalValue = await calculateTotalValue(item_code, quantity);

        // Create the order
        const newOrder = await Order.create({
            user_id,
            order_date,
            item_code,
            item_name,
            quantity,
            total_value: totalValue,
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Endpoint to delete an order
const deleteOrder = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ error: 'please authenticate' });
    }
    try {
        const { orderId } = req.params;
        // Find the order by ID and delete it
        const deletedOrder = await Order.destroy({
            where: { id: orderId },
        });
        console.log("1111111111111111111111111111111111111111")
        if (deletedOrder) {
            return res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Function to calculate the total value of an order
const calculateTotalValue = async (itemCode, quantity) => {
    try {
        const item = await Inventory.findOne({
            where: { id: itemCode }
        });

        if (!item) {
            throw new Error('Invalid item or Item not found in inventory');
        }

        if (quantity > item.quantity) {
            throw new Error('Not this amount of quantity availabe in the inventory.  Try with few less quantity');
        }


        const totalValue = item.price * quantity;
        return totalValue;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    createOrder,
    deleteOrder,
};
