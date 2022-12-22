const express = require("express")
const router = express.Router()
const MW = require('../middleware/auth')
const{getProduct, getProductById , creatProduct , updateProduct , deleteProduct} = require("../controller/productController")
const userController = require("../controller/userController")
const cartController = require("../controller/cartController")
//--------------------------------------------User Api--------------------------------------------------------------//

router.post("/register",userController.registerUser)
router.post("/login",userController.login)
router.get("/user/:userId/profile", MW.Authentication ,userController.getUserProfile)
router.put("/user/:userId/profile",MW.Authentication ,userController.updateUsersProfile)

//--------------------------------------------Product Api-----------------------------------------------------------//

router.post("/products",creatProduct)
router.get("/products/:productId",getProductById)
router.get("/products",getProduct)
router.put("/products/:productId",updateProduct)
router.delete("/products/:productId", deleteProduct)

//Cart API's
router.post("/users/:userId/cart",cartController.createCart)








module.exports=router

