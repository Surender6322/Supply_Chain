const express = require("express")
const auth = require("../middleware/auth")

const {register,login,logoutall} = require("../controllers/user")

const router = new express.Router()

router.post("users/add",auth,register)
router.post("/login",login)
router.post("/logoutall",auth,logoutall)

module.exports = router