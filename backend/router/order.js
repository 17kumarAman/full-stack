const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");

const {
  addToOrder,
  getOrdersByUserId,
} = require("../controllers/orderController"); // Ensure this path is correct

// Route to place an order
router.post("/order", addToOrder);

// Route to get all orders by userId
router.route("/orders/:userId").get(authorize, getOrdersByUserId);

// Export the router
module.exports = router;
