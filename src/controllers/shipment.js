const db = require("../db/index")
const Shipment = db.shipments
const Order = db.order
const Inventory = db.inventory

const addShipment = async (req, res) => {
    if (!req.user || req.user.role === 'Customer' ) {
        res.status(400).json({ error: 'Please authenticate as a Manager or Staff' });
    }
    try {
        const { orderId,destination,shipment_date,expected_delivery,current_location,status } = req.body;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
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
        if (!req.user || req.user.role === 'Customer' ) {
            res.status(400).json({ error: 'Please authenticate as a Manager or Staff' });
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