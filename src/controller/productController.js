const { isValidObjectId } = require('mongoose')
const productModel = require('../Model/productModel')
const {isValidImg , isValidPrice , checkSize, ValidTitle } = require('../validation/validation')
const {uploadFile} = require('../aws/aws')

const creatProduct = async (req,res)=> {
    try{
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please give me some data" })  

        let product_image = req.files
        if(!product_image[0]) return res.status(400).send({ status: false, message: "please provide product_image" })
        if(!isValidImg(product_image[0].originalname)){ return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG",  }) }

        let { title, description, price,currencyId, currencyFormat,availableSizes } = data
        if(!title) return res.status(400).send({ status: false, message: "please give title" })
        let uniqueTitle = await productModel.findOne({title})
        if(uniqueTitle) return res.status(400).send({ status: false, message: "title should be unique" })
        if(!description) return res.status(400).send({ status: false, message: "please give description" })
        if(!price) return res.status(400).send({ status: false, message: "please give price" })
        if(!currencyId) return res.status(400).send({ status: false, message: "please give currencyId" })
        if(!currencyFormat) return res.status(400).send({ status: false, message: "please give currencyFormat" })

        let size = availableSizes.split(' ')
        availableSizes = size

        if(!ValidTitle(title)) return res.status(400).send({ status: false, message: "please provide valid title" })
        if(!isValidPrice(price)) return res.status(400).send({ status: false, message: "please provide valid price" })
        if(!checkSize(availableSizes)) return res.status(400).send({ status: false, message: 'please provide only  this /"S"/"XS"/"M"/"X"/"L"/"XXL"/"XL"] Size '} )
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


const getProductById = async (req,res)=>{
    try{
        let productId = req.params.productId
        if(!productId) return res.status(400).send({ status: false, message: "please provide productId" })
        if(!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "please provide valid productId" })

        let  productData = await productModel.findById(productId)
        if(!productData) return res.status(404).send({ status: false, message: "Product Not Found" })

        return res.status(200).send({status : true, data : productData })

        }catch(err){
        return res.status(500).send({status : false , message : err.message})
        }
}
module.exports = { creatProduct , getProductById }