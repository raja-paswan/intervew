const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refs: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          refs: "product",
          required: true,
        },
      },
      { quantity: Number, required: true, min: 1 },
    ],
    totalPrice: {
      type: Number,
      required: true,
      comment: "Holds total price of all the items in the cart",
    },
    totalItems: {
      type: Number,
      required: true,
      comment: "Holds total number of items in the cart",
    },
    totatlQuantity: {
      type: Number,
      required: true,
      comment: "Holds total number of quantity in the cart",
    },
    cancellable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: [pending, completed, canceled],
      default: "pending",
    },
    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
