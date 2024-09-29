const mongoose = require("mongoose");

// Define cartItemSchema with timestamps for individual cart items
const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }, // Quantity field
  },
  { _id: false, timestamps: true } // Timestamps for cart items
);

// Define Cart schema associated with the userId
const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User association
    items: [cartItemSchema], // Array of cart items
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
