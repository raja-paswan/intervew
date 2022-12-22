const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        refs: "User",
        required: true,
        unique: true
    },
    items:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            refs: "product",
            unique: true
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalPrice:{
        type: Number,
        required: true,
        comment: "Hold total price of all the items in the carts"
    },
    totalItems:{
        type: Number,
        required: true,
        comment: "Holds total number of items in the cart"
    }
},{timestamsp: true});

module.exports = mongoose.model("Cart", cartSchema)
