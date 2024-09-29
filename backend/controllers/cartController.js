const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

// Get Cart by userId
const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    // console.log(cart.items);
    res.status(200).json({
      msg: "Cart fetched successfully",
      cart: cart.items,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Add Product to Cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Find or create the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product is already in the cart
    const productInCart = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (productInCart) {
      // If the product is already in the cart, increase the quantity
      productInCart.quantity += 1;
    } else {
      // Otherwise, add the product to the user's cart with all its properties
      cart.items.push({
        productId: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        quantity: 1, // Initially, the quantity is set to 1
      });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      msg: "Product added to cart successfully",
      cart: cart.items,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Increase or Decrease Quantity in Cart
const updateQuantity = async (req, res) => {
  const { userId, productId } = req.params;
  const { action } = req.body; // action will be 'increase' or 'decrease'

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Find the product in the cart
    const productInCart = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!productInCart) {
      return res.status(404).json({ msg: "Product not found in cart" });
    }

    // Increase or decrease quantity
    if (action === "increase") {
      productInCart.quantity += 1; // Increment the quantity if the action is 'increase'
    } else if (action === "decrease") {
      if (productInCart.quantity > 1) {
        productInCart.quantity -= 1; // Decrease the quantity
      } else {
        // If quantity is 1, remove the product from the cart
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }

    // Save the updated cart
    await cart.save();

    // Send a success response with the updated cart
    return res.status(200).json({
      msg: `Product quantity ${action}d successfully`,
      cart: cart.items,
    });
  } catch (error) {
    console.error(`Error ${action}ing quantity:`, error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Remove Product from Cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const updatedItems = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.items = updatedItems;
    await cart.save();

    res.status(200).json({
      msg: "Product removed from cart successfully",
      cart: cart.items,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ msg: "Internal server error", error });
  }
};

// Delete Cart
const deleteCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    res.status(200).json({ msg: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  updateQuantity,
  deleteCart,
};
