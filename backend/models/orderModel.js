const mongoose = require("mongoose");

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: {
      type: String,
      required: true,
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: String,
    description: String,
    price: String,
    image: String,
    quantity: { type: Number, default: 1 }, // Quantity field
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
