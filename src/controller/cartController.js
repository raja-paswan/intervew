const userModel = require('../Model/userModel')
const productModel = require('../Model/productModel')
const cartModel = require('../Model/cartModel')


const createCart = async function(req,res){
    try{
        const userId = req.params.userId
        const tokenUserId = req.userId  //check
        const cartData = req.body;

        if(!userId){return res.status(400).send({status:false, message:`provide userId`})}

        if(!isValidObjectId(userId)){return res.status(400).send({status:false,messsage:`userId Invalid`})}

        if(!isValidObjectId(tokenUserId)){return res.status(400).send({status:false,message:`invalid tokenUserId`})}
            
        if(tokenUserId != userId){return res.status(403).send({status:false, message:`you are not authorised`})}

        const user = await userModel.findOne({_id:userId})

        if(!user){return res.status(404).send({status:false,message:`user not found`})}

        if(!isValidRequestBody(cartData)){return res.status(400).send({status:false, message:`provide cart details`})}

        const {productId, quantity, cartId, } = req.body;
    
        if(!isValidObjectId(productId)){return res.status(400).send({status:false,message:`invalid productId`})}

        const checkProduct = await productModel.findOne({_id: productId, isDeleted:false})

        if(!checkProduct){return res.status(404).send({status:false,message:`product not found`})}


    }catch(error){
        return res.status(500).send({status:false, messsage:error.messsage})
    }
}

module.exports = {createCart}