const db = require("../db/index")
const Shipment = db.shipments
const Order = db.order
const Inventory = db.inventory

const addShipment = async (req, res) => {
    if (!req.user) {
        res.status(400).json({ error: 'Please authenticate!' });
    }
    try {
        const { orderId,destination,shipment_date,expected_delivery,current_location,status } = req.body;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Fetch details of item_code and quantity from the order
        const { item_code, quantity } = order;
        
        // Fetch the current quantity from the inventory table
        const inventoryItem = await Inventory.findOne({ where: { id: item_code } });

        if (!inventoryItem || inventoryItem.quantity <= 0) {
            return res.status(400).json({message : "Item out of stock!"});
        }
        
        // Perform operations on the quantity
        const updatedQuantity = inventoryItem.quantity - quantity;

        if (updatedQuantity < 0) {
            return res.status(400).json({ error: 'Insufficient quantity in the inventory' });
        }

        // Create a new shipment
        const shipment = await Shipment.create({
            orderId: orderId,
            destination: destination,
            shipment_date: shipment_date,
            expected_delivery: expected_delivery,
            status: status, // Initial status
            current_location: current_location , // Initial location
        });



        // Update the inventory with the new quantity
        await Inventory.update({ quantity: updatedQuantity }, { where: { id: item_code } });


        // Store the tracking ID for future reference
        const trackingId = shipment.id;

        res.status(201).json({ message: 'Shipment created',shipment, trackingId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateShipment = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).send({ error: 'Please authenticate!' })
        }
        const updates = Object.keys(req.body);
        const allowedUpdates = ["expected_delivery", "current_location", "status"]
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }
        const shipment = await Shipment.findOne({ where: { id: req.params.trackingld } })
        updates.forEach((update) => shipment[update] = req.body[update])
        await shipment.update()
        res.status(200).json({ message: 'Shipment status updated successfully', shipment })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}



module.exports = {
    addShipment,
    updateShipment
}