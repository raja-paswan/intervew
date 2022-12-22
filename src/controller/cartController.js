const userModel = require('../Model/userModel')
const productModel = require('../Model/productModel')
const cartModel = require('../Model/cartModel')
const{isValidObjectId,isValidRequestBody} = require("../validation/validation")


const createCart = async function(req,res){
    // try{
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





    // }catch(error){
    //     return res.status(500).send({status:false, messsage:error.messsage})
    // }
}

module.exports = {createCart}