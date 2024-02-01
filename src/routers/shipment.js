const express = require("express")
const auth = require("../middleware/auth")

const {addShipment,updateShipment} = require("../controllers/shipment")

const router = new express.Router()

router.post("/shipment/create",auth,addShipment)
router.patch("/shipment/update",auth,updateShipment)

module.exports = router