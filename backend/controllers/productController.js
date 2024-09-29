const Product = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    const { title, price, description, image, category } = req.body;
    console.log("Request Body:", req.body);

    if (!title || !price || !description || !image || !category) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if the product already exists by price
    const productExist = await Product.findOne({ title });
    if (productExist) {
      return res.status(400).json({ msg: "product already exists" });
    }

    // Create a new product
    const productCreated = await Product.create({
      title,
      price,
      description,
      image,
      category
    });

    res.status(201).json({
      msg: "Registration Successful",
      productId: productCreated._id.toString(),
    });
  } catch (error) {
    console.error("Error during product registration:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ msg: "Invalid input data" });
    }

    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const products = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    if (!products.length) {
      return res.status(404).json({ msg: "No products found" });
    }

    res.status(200).json({
      msg: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
};

// Update product details
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, price, description, image } = req.body;

    // Validate input data
    if (!title || !price || !description || !image) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if product exists
    const productExist = await Product.findById(productId);
    if (!productExist) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update product details
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { title, price, description, image }, // Pass only the fields you want to update
      { new: true, runValidators: true } // Returns the updated document
    );

    res.status(200).json({
      msg: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({
      msg: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const productExist = await Product.findById(productId);
    if (!productExist) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

module.exports = {
  addProduct,
  products,
  deleteProduct,
  singleProduct,
  updateProduct,
};
