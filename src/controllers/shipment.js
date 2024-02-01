const db = require("../db/index")
const Shipment = db.shipments

const addShipment = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(500).json({ message: "Please authenticate as a manager!" })
        }
        const newShipment = await Shipment.create(req.body)
        res.status(201).json({ message: "Shipment created successfully", trackingId: newShipment.id })
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const updateShipment = async (req, res) => {
    try {
        const { currentLocation, status } = req.body;
        const { trackingld } = req.params;

        // Check if the shipment with the given tracking ID exists
        const shipment = await Shipment.findOne({ where: { id: trackingld } });

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Update the shipment status
        if (currentLocation !== undefined) {
            shipment.currentLocation = currentLocation;
        }

        if (status !== undefined) {
            shipment.status = status;
        }

        await shipment.save();

        res.status(201).json({ message: 'Shipment status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = {
    addShipment,
    updateShipment
}