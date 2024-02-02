const express = require("express")
const auth = require("../middleware/auth")

const {register,login,logoutAll,getProfile} = require("../controllers/user")

const router = new express.Router()

router.post("/users/add",auth,register)
router.post("/login",login)
router.post("/logoutall",auth,logoutAll)
router.get("/profile",auth,getProfile)

module.exports = router