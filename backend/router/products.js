const express = require("express");
const router = express.Router();

const {
  addProduct,
  products,
  deleteProduct,
  singleProduct,
  updateProduct,
} = require("../controllers/productController");

router.route("/products").post(addProduct).get(products);
router
  .route("/product/:id")
  .get(singleProduct)
  .put(updateProduct) // Update user details
  .delete(deleteProduct); // Delete user

module.exports = router;
