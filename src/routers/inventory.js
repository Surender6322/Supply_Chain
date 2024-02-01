const express = require("express")
const auth = require("../middleware/auth")

const {addItem} = require("../controllers/inventory")

const router = new express.Router()

router.post("/inventory/add",auth,addItem)

module.exports = router