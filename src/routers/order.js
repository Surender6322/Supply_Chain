const express = require("express")
const auth = require("../middleware/auth")

const {createOrder,deleteOrder} = require("../controllers/order")

const router = new express.Router()

router.post("/createOrder",auth,createOrder)
router.delete("/deleteOrder/:orderId",auth,deleteOrder)

module.exports = router