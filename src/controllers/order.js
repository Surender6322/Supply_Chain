const db = require('../db/dbconfig')
const Inventory = db.inventory;
const Orders = db.orders;
 
 
 
// Endpoint to create an order
const createOrder = async (req, res) => {
 
  if (!req.user) {
    res.status(400).json({ error: 'please authenticate' });
  }
 
  if (req.user.role !== "customer") {
    res.status(400).json({ error: 'please authenticate as a customer' });
  }
  try {
 
    const { item_code, item_name, quantity } = req.body;
 
    const user_id = req.user.id;
    order_date = new Date();
    // Check if the quantity in the order is greater than 0
    if (quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity in the order' });
    }
 
 
    // Fetch the current quantity from the inventory table
    const inventoryItem = await Inventory.findOne({ where: { id: item_code } });
 
    if (!inventoryItem) {
      return res.status(400).json({ error: 'Item deleted from inventory or Invalid item_code in the order' });
    }
 
    // Perform operations on the quantity
    const updatedQuantity = inventoryItem.quantity - quantity;
 
    if (updatedQuantity < 0) {
      return res.status(400).json({ error: 'Insufficient quantity in the inventory' });
    }
 
 
    // Calculate total value based on item's price from inventory
    const totalValue = await calculateTotalValue(item_code, quantity);
 
    // Create the order
    const newOrder = await Orders.create({
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
    res.status(400).json({ error: 'please authenticate' });
  }
 
  if (req.user.role !== "customer") {
    res.status(400).json({ error: 'please authenticate as a customer' });
  }
  try {
    const { orderId } = req.params;
 
    const order = await Orders.findByPk(orderId);
 
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Fetch the current quantity from the inventory table
    const inventoryItem = await Inventory.findOne({ where: { id: order.item_code } });
 
    if (!inventoryItem) {
      return res.status(400).json({ error: 'Item deleted from inventory or Invalid item_code in the order' });
    }
 
    // Perform operations on the quantity
    inventoryItem.quantity = inventoryItem.quantity + order.quantity;
 
    await inventoryItem.save();
    // Find the order by ID and delete it
    const deletedOrder = await Orders.destroy({
      where: { id: orderId },
    });
 
    if (deletedOrder) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
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
 