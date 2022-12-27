const express = require("express")
const router = express.Router()
const { Authentication, Authrization} = require('../middleware/auth')
const{ getProduct, getProductById , creatProduct , updateProduct , deleteProduct} = require("../controller/productController")
const { getUserProfile, updateUserProfile, login , registerUser} = require("../controller/userController")
const {createOrder, updateOrder} = require('../controller/orderController')
const { createCart, getcart ,updateCart ,deleteCart } = require("../controller/cartController")


//--------------------------------------------User Api--------------------------------------------------------------//

router.post("/register", registerUser )
router.post("/login",  login )
router.get("/user/:userId/profile",  Authentication , Authrization, getUserProfile )
router.put("/user/:userId/profile",  Authentication , Authrization,updateUserProfile )

//--------------------------------------------Product Api-----------------------------------------------------------//

router.post("/products",  creatProduct )
router.get("/products/:productId",  getProductById )
router.get("/products",  getProduct )
router.put("/products/:productId",  updateProduct )
router.delete("/products/:productId",  deleteProduct )

//--------------------------------------------Cart Api--------------------------------------------------------------//

router.post("/users/:userId/cart", createCart )
router.get("/users/:userId/cart",  getcart )
router.put("/users/:userId/cart", updateCart )
router.delete("/users/:userId/cart",  deleteCart )

//---------------------------------------------Order Api------------------------------------------------------------//

router.post("/users/:userId/orders",createOrder )
router.put("/users/:userId/orders", updateOrder )






module.exports=router

