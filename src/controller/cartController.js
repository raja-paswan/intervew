const userModel = require('../Model/userModel')
const productModel = require('../Model/productModel')
const cartModel = require('../Model/cartModel')
const{isValidObjectId,isValidRequestBody} = require("../validation/validation")
const { findByIdAndUpdate } = require('../Model/productModel')


const createCart = async function(req,res){
    try{
        const userId = req.params.userId
        
        const cartData = req.body;

        if(!userId){return res.status(400).send({status:false, message:`provide userId`})}

        if(!isValidObjectId(userId)){return res.status(400).send({status:false,messsage:`userId Invalid`})}

        // if(!isValidObjectId(tokenUserId)){return res.status(400).send({status:false,message:`invalid tokenUserId`})}
            
        // if(tokenUserId != userId){return res.status(403).send({status:false, message:`you are not authorised`})}

        const user = await userModel.findOne({_id:userId})

        if(!user){return res.status(404).send({status:false,message:`user not found`})}

        if(!isValidRequestBody(cartData)){return res.status(400).send({status:false, message:`provide cart details`})}

        const {productId, cartId, } = cartData;
        if(!isValidObjectId(productId)){return res.status(400).send({status:false,message:`invalid productId`})}

        const checkProduct = await productModel.findOne({_id: productId, isDeleted:false})
        
        if(!cartId){
        
        cartData.items = []
    

        if(!checkProduct){return res.status(404).send({status:false,message:`product not found`})}
        
        cartData.userId = userId
        cartData.items.push({productId:productId,quantity:1})
        cartData.totalPrice = checkProduct.price
        cartData.totalItems = 1

        const toSend = await cartModel.create(cartData)
        console.log(toSend)
        return res.status(201).send({status:true,message:"success",data:toSend})
        }

        if(!isValidObjectId(cartId)) {return res.status(400).send({status:false,message:`invalid cartId`})}
        let carT = await cartModel.findById(cartId).lean()
        if(!carT) {return res.status(404).send({status:false,message:`unable to find cart`})}

       const found = carT.items.find(x=>x.productId==productId)
       
       if(found!=undefined){
        carT.items[carT.items.indexOf(found)].quantity = carT.items[carT.items.indexOf(found)].quantity+1
       }else{
        carT.items.push({productId:productId,quantity:1})
       }
       carT.totalItems = carT.items.length
       carT.totalPrice = carT.totalPrice + checkProduct.price

       const toSend = await cartModel.findByIdAndUpdate(cartId,
        {
           items:carT.items,
           totalItems:carT.totalItems,
           totalPrice:carT.totalPrice

       },
       {new:true})

       return res.status(201).send({status:true,message:"success",data:toSend})





    }catch(error){
        return res.status(500).send({status:false, messsage:error.messsage})
    }
}

const getcart = async (req,res)=>{
    try{
    let userId = req.params.userId 
    if(!userId) return res.status(400).send({status : false , message : "please provide userId"})
    if(!isValidObjectId(userId)) return res.status(400).send({status : false , message : " inValid userId"})
  
    let checkUser = await userModel.findOne({_id : userId })
    if(!checkUser) return res.status(404).send({status : false , message : "Given  userId not exits our user data "})

     let found_Cart = await cartModel.findOne({userId : userId})
     if(!found_Cart) return res.status(404).send({status : false , message : "Given  userId not exits our cart data"})
   

     return res.status(200).send({status : false, data : found_Cart })

    }catch(err){
    return res.status(500).send({ status : false, message : err.message })
    }
}

const  updateCart = async (req,res)=>{
    try{
        let data = req.body
        if(!isValidRequestBody(data)) return res.status(400).send({status:false,message:"plese provide data"})
        const{cartId,productId,removeProduct} = data
        if(!cartId) return res.status(400).send({status:false,message:"plese provide cartId"})
        if(!productId) return res.status(400).send({status:false,message:"plese provide productId"})
        let product = await productModel.findOne({_id:productId,isDeleted:false})
        if(!product) return res.status(404).send({status:false,message:"unable to find product"})
        console.log(removeProduct)
        if(removeProduct!=1 && removeProduct!=0) return res.status(400).send({status:false,message:"do you want to delete product(use removeProduct:0) or if you want to reduce quantity(use removeProduct:1"})
        
        let carT = await cartModel.findById(cartId).lean()
         
        if(!carT) return res.status(404).send({status:false,message:"unable to find cart"})
        const found = carT.items.find(x=>x.productId==productId)
        if(!found) return res.status(404).send({status:false,message:"unable to find product in cart"})

        if(removeProduct =="0"){
        carT.items.splice(carT.items.indexOf(found),1)
        carT.totalItems = carT.totalItems -1
        carT.totalPrice = carT.totalPrice-product.price

        
    }
    if(removeProduct=="1"){
        // let carT = await cartModel.findById(cartId).lean()
        // if(!carT) return res.status(404).send({status:false,message:"unable to find cart"})
        // const found = carT.items.find(x=>x.productId==productId)
        // if(!found) return res.status(404).send({status:false,message:"unable to find product in cart"})
        carT.items[carT.items.indexOf(found)].quantity = carT.items[carT.items.indexOf(found)].quantity-1
        
        if(carT.items[carT.items.indexOf(found)].quantity==0){
            carT.items.splice(carT.items.indexOf(found),1)
            carT.totalItems=carT.totalItems-1
        }
        
        carT.totalPrice = carT.totalPrice-product.price
        
        
        
    }
    
    const toSend = await cartModel.findByIdAndUpdate(cartId,{
        items:carT.items,
        totalItems:carT.totalItems,
        totalPrice:carT.totalPrice,
    
    },{new:true})
    res.status(200).send({status:true,message:"sucess",data:toSend})
}catch(err){
    return res.status(500).send({status:false,message:err.message})
}
}

module.exports = {createCart,getcart,updateCart}