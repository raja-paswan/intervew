const jwt = require("jsonwebtoken")
const { isValidObjectId } = require('mongoose')
const userModel = require("../Model/userModel")

const Authentication = async (req, res, next) => {
    try {
        const Token = req.headers["x-api-key"]
        if (!Token) return res.status(400).send({ status: false, message: "token is not present" })

        jwt.verify(Token, "key-group-1", function (err, token){
        if (err) {
        return res.status(401).send({ status: false, message: " Token is invalid Or Token has been Expired" })
        }
        else {
        req.userId = token.userId
        next()
        }})

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const Authrization = async (req, res, next) => {
    try {
        const userID = req.userId
        let userId = req.params.userId
        if (!userId) return res.status(400).send({ status: false, message: " userId  not present in params" })
        if (!isValidObjectId(userId)) return res.status(401).send({ status: false, message: " invalid userId" })

        let userData = await userModel.findOne({ _id: userId})
        if (!userData) return res.status(404).send({ status: false, message: "User Not found" })
    
        if (userID != userId) { return res.status(403).send({ status: false, message: "You are not Authrize User" }) }

        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}
module.exports = {Authentication , Authrization }