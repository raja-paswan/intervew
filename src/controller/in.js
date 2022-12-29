// const { uploadFile } = require("../aws/aws")
// const userModel = require("../Model/userModel")

// const createuser = async (req, res) => {
//     try {
//         const data = req.body

//         let product_image = req.files
//         let { fename, lname, email, phone, passward, address } = data
//         if (!address.shipping.street) {
//             return res.status(400).send({ status: false, message: "please give proper address" })
//         }
//         if (!address.shipping.city) {
//             return res.status(400).send({ status: false, message: "please give proper address" })
//         }
//         if (!address.shipping.pincode) {
//             return res.status(400).send({ status: false, message: "please give proper address" })
//         }
//         if (!Image[0]) {
//             return res.status(400).send({ status: false, message: "please give image" })
//         }
//         let url = await uploadFile(Image[0])
//         data["profileImage"] = url

//         let salt = await bcrypt.gensalt(10)
//         data.passward = await bcrypt.hash(data.passward, salt)
       
//         const user=await userModel.create(data)
//           return res.status(201).send({status:true,data:user})
//         }catch(err){
//             return res.status(500).send({message:err.message})
//         }
//     }
