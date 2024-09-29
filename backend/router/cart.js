const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCart,
  deleteCart,

  updateQuantity,
} = require("../controllers/cartController");
const authorize = require("../middlewares/authorize");
router.route("/cart/:userId/:productId").post(addToCart).delete(removeFromCart);

router.route("/cart/update/:userId/:productId").post(updateQuantity);

router.route("/cart/:userId").get(getCart).delete(deleteCart);
// router.route("/:id").get(getCart)F; // Delete user

module.exports = router;
