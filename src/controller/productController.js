const { isValidObjectId } = require('mongoose')
const productModel = require('../Model/productModel')
const {isValidImg , isValidPrice ,isValidSize, checkSize, ValidTitle,isValidTitle } = require('../validation/validation')
const {uploadFile} = require('../aws/aws')

const creatProduct = async (req,res)=> {
    try{
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please give me some data" })  

        let product_image = req.files
        if(!product_image[0]) return res.status(400).send({ status: false, message: "please provide product_image" })
        if(!isValidImg(product_image[0].originalname)){ return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG",  }) }

        let { title, description, price,currencyId, currencyFormat,availableSizes,installment } = data
        if(!title) return res.status(400).send({ status: false, message: "please give title" })
        let uniqueTitle = await productModel.findOne({title})
        if(uniqueTitle) return res.status(400).send({ status: false, message: "title should be unique" })
        if(!description) return res.status(400).send({ status: false, message: "please give description" })
        if(!price) return res.status(400).send({ status: false, message: "please give price" })
        if(!currencyId) return res.status(400).send({ status: false, message: "please give currencyId" })
        if(!currencyFormat) return res.status(400).send({ status: false, message: "please give currencyFormat" })
        if(installment){
        if(parseInt(installment)==NaN){
        return res.status(400).send({ status: false, message: "invalid intallment format use number format" })
        }
        }
        if(!availableSizes) return res.status(400).send({status : false , message :"Give me at least one size" })
        if(availableSizes.includes(',')){
        let size = availableSizes.split(',')
        const arr = size.map(x=> x.trim()).filter(y=>y.length!=0 && !y.includes(',')).map(z=>z.toUpperCase())
        if(!checkSize(arr)) return res.status(400).send({ status: false, message: 'please provide only  this /"S"/"XS"/"M"/"X"/"L"/"XXL"/"XL"] Size '} )
        data.availableSizes = arr
        }else{
    
        let size = availableSizes.split(' ')
        const arr = size.map(x=> x.trim()).filter(y=>y.length!=0).map(z=>z.toUpperCase())
        if(!checkSize(arr)) return res.status(400).send({ status: false, message: 'please provide only  this /"S"/"XS"/"M"/"X"/"L"/"XXL"/"XL"] Size '} )
        data.availableSizes = arr
        }
     
     
        
        

        if(!isValidTitle(title)) return res.status(400).send({ status: false, message: "please provide valid title" })
        if(!isValidPrice(price)) return res.status(400).send({ status: false, message: "please provide valid price" })
        
        if(currencyId !== "INR") return res.status(400).send({ status: false, message: "please provide 'INR' " })
        if(currencyFormat !== "₹") return res.status(400).send({ status: false, message: "please provide  '₹' " })


        let url = await uploadFile(product_image[0])
        data["productImage"] = url
        let product = await productModel.create(data)
        return res.status(201).send({ status: true, message: "Product is successfully created",data: product,
        })


    }catch(err){
     return res.status(500).send({status : false , message : err.message})
    }
}

const getProduct = async (req, res) => {
    try {
        let fillTers = req.query
        fillTers.isDeleted = false
        const { name, priceGreaterThan, priceLessThan, size, priceSort } = fillTers
        if (name) {
            if (!isValidTitle(name)) return res.status(400).send({ status:false,message: "invalid product name" })
            fillTers.title = { $regex: name, $options: "i" }
            delete fillTers.name
        }
        
        if (priceGreaterThan != undefined){
        if ( typeof (parseInt(priceGreaterThan)) == NaN) return res.status(400).send({ status:false,message: "ivalid product priceGreater Than cap" })
        }
        if(priceLessThan != undefined){
        if (typeof (priceLessThan) == String) return res.status(400).send({status:false, message: "ivalid product priceless Than cap" })
        }
        if(size!=undefined){
        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size)) return res.status(400).send({status:false, message: "This size is not available" })
        fillTers.availableSizes=size
        delete fillTers.size
        }
        
        if(priceSort!=undefined){
        if (parseInt(priceSort) != -1 && parseInt(priceSort) != 1) return res.status(400).send({ message: "for sorting provide 1 for accending and -1 for deccending order" })
        delete fillTers.priceSort
        }
        
        if (priceLessThan && priceGreaterThan==undefined) {
            fillTers.price = { $lt: priceLessThan }
            delete fillTers.priceLessThan
        }
        
        if (priceGreaterThan && priceLessThan==undefined) {
            fillTers.price = { $gt: priceGreaterThan }
            delete fillTers.priceGreaterThan
        } 
        
        if (priceGreaterThan && priceLessThan) {
            fillTers.price = { $gt: priceGreaterThan, $lt: priceLessThan }
            delete fillTers.priceGreaterThan
            delete fillTers.priceLessThan
            
        }
        

        const toSend = await productModel.find(fillTers).sort({ price: parseInt(priceSort) })
        if(toSend.length==0){return res.status(404).send({status:false,message:"No products found"})}
        res.status(200).send({ status: true, message: "success", data: toSend })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

    

}


const getProductById = async (req,res)=>{
    try{
        let productId = req.params.productId
        if(!productId) return res.status(400).send({ status: false, message: "please provide productId" })
        if(!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "please provide valid productId" })

        let  productData = await productModel.findOne({_id:productId,isDeleted:false})
        if(!productData) return res.status(404).send({ status: false, message: "Product Not Found" })

        return res.status(200).send({status : true, data : productData })

        }catch(err){
        return res.status(500).send({status : false , message : err.message})
        }
}


const updateProduct = async (req,res)=>{
    try{
        let data = req.body
        
        let product_image = req.files
        
        if(Object.keys(data).length==0 && product_image.length==0) return res.status(400).send({ status: false, message: "please give me some data for update " })
        
        let { title , description ,price ,availableSizes, productImage, installments} = data
        if(productImage)
        if(productImage.trim().length == 0 || productImage){
          return res.status(400).send({ status: false, message: " invalid productImage " })
        }

        if(product_image.length == 1){
        
        if(!isValidImg(product_image[0].originalname))
        { return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG",  }) }
        let url = await uploadFile(product_image[0])
        data["productImage"] = url
        }
        const productId = req.params.productId
        if(!productId) return res.status(400).send({ status: false, message: "please give me productId " })
        if(!isValidObjectId(productId))  return res.status(400).send({ status: false, message: "Invalid productId" })

        let found = await productModel.findOne({ _id :productId, isDeleted : false})
        if(!found)  return res.status(404).send({ status: false, message: "Product not Found by productId & product data already deleted " })

        if(title){
        if(title.trim().length == 0)  return res.status(400).send({ status: false, message: "Title should not be empty & blanck space" })
        let uniqueTitle = await productModel.findOne({title})
        if(uniqueTitle)  return res.status(404).send({ status: false, message: "title should be unique" })
        }
       
        if(description){
       
        if(description.trim().length == 0)  return res.status(400).send({ status: false, message:" description should not be empty & blanck space" })
        }

        if(price){
        if(!isValidPrice(price))return res.status(400).send({status : false , message : "invalid Price"})
        }
  
        
        if(installments){
          let a = /^\d+$/
         if(!a.test(installments))  return res.status(400).send({status : false , message : "invalid installments"}) 
        }

        // if(availableSizes){
        // availableSizes = availableSizes.toUpperCase().split(' ').map((e)=> e.trim())
        // // if(!checkSize(availableSizes)) return res.status(400).send({status : false , message : "invalid Size"})
        // }  
        

        // if (availableSizes) {
        //     availableSizes = availableSizes.toUpperCase().split(',').map((item) => item.trim())
        //     for (let i = 0; i < availableSizes.length; i++) {
        //     if (!isValidSize(availableSizes[i])) return res.status(400).send({ status: false, message: "Please mention valid Size!" });
        //     }
        // }
        if(availableSizes){
            if(availableSizes.includes(',')){
            let size = availableSizes.split(',')
            const arr = size.map(x=> x.trim()).filter(y=>y.length!=0 && !y.includes(',')).map(z=>z.toUpperCase())
            if(!checkSize(arr)) return res.status(400).send({ status: false, message: 'please provide only  this /"S"/"XS"/"M"/"X"/"L"/"XXL"/"XL"] Size '} )
            let result = [... new Set(arr)]
            data.availableSizes = result

            
            
            }else{
        
            let size = availableSizes.split(' ')
            const arr = size.map(x=> x.trim()).filter(y=>y.length!=0).map(z=>z.toUpperCase())
            if(!checkSize(arr)) return res.status(400).send({ status: false, message: 'please provide only  this /"S"/"XS"/"M"/"X"/"L"/"XXL"/"XL"] Size '} )
            let result = [... new Set(arr)]
            data.availableSizes = result
            }
        }
        // else{
        //     return res.status(400).send({status : false , message : "empty string given" })
        // }
            // if (availableSizes) {

            //     let sizeArray = found.availableSizes
            //     for (let i = 0; i < sizeArray.length; i++) {
            //         availableSizes.push(sizeArray[i])
            //     }
            //     let result = [... new Set(availableSizes)]
            //     data.availableSizes = result
    
            // }
        let updatedProduct = await productModel.findByIdAndUpdate(
        { _id :productId},
        data,
        { upsert : true, new : true,}
        )

       return res.status(200).send({status : true, data : updatedProduct})
       }
       catch(err){
        return res.status(500).send({status : false , message : err.message })
      }
}


const deleteProduct = async function(req,res)
{
        try{
        const productId = req.params.productId;
        if(!productId){
        return res.status(400).send({staus:false, message:`ProductId is Required`})
        }
        if(!(isValidObjectId(productId))){
        return res.status(400).send({status:false, message:`Invalid ProudctId`})
        }
        const removeProduct = await productModel.findOneAndUpdate({_id: productId, isDeleted:false},
        {$set:{isDeleted:true, deletedAt: Date.now()}}
        );
        if(!removeProduct){
        res.status(400).send({status:false, message:`Product is Not Found or Product is already Deleted`})
        return
        }else{
        res.status(200).send({status:true, message:`Deleted Successfully`})
        return
        }
        }catch(error){
        return res.status(400).send({status:false, Message: error.message})
        }
}
module.exports = { creatProduct , getProductById ,getProduct, deleteProduct, updateProduct }