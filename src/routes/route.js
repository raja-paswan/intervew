const express = require("express")
const router = express.Router()
const MW = require('../middleware/auth')
const{getProduct,getProductById,creatProduct} = require("../controller/productController")
const userController = require("../controller/userController")
//--------------------------------------------User Api--------------------------------------------------------------//

router.post("/register",userController.registerUser)
router.post("/login",userController.login)
router.get("/user/:userId/profile", MW.Authentication ,userController.getUserProfile)
router.put("/user/:userId/profile",MW.Authentication ,userController.updateUsersProfile)

//--------------------------------------------Product Api-----------------------------------------------------------//

router.post("/products",creatProduct)
router.get("/products/:productId",getProductById)
router.get("/products",getProduct)









module.exports=router

