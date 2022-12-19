const express = require("express")
const router = express.Router()
const MW = require('../middleware/auth')

const userController = require("../controller/userController")

router.post("/register",userController.registerUser)
router.post("/login",userController.login)
router.get("/user/:userId/profile ", MW.Authentication ,userController.getUserProfile)







module.exports=router

