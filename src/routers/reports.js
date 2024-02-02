const express = require("express")
const auth = require("../middleware/auth")

const {shipmentReport,inventoryReport} = require("../controllers/report")

const router = new express.Router()

router.get("/reports/shipments",auth,shipmentReport)
router.get("/reports/inventory",auth,inventoryReport)

module.exports = router