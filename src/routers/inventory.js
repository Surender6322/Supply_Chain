const express = require("express")
const auth = require("../middleware/auth")

const {addItem,getItem} = require("../controllers/inventory")

const router = new express.Router()

router.post("/inventory/add",auth,addItem)
router.get("/getInventory",auth,getItem)

module.exports = router