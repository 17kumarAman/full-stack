const Order = require("../models/orderModel"); // Correct model import for Order
const Product = require("../models/productModel");

const addToOrder = async (req, res) => {
  try {
    const { userId, address, products } = req.body;

    // Check if products is an array (multiple products) or a single object (one product)
    const isMultipleProducts = Array.isArray(products);

    // Prepare an array to store the order details
    let orderDetails = [];

    if (isMultipleProducts) {
      // If multiple products, loop through each product and process the order
      for (let i = 0; i < products.length; i++) {
        const { productId, quantity } = products[i];

        // Fetch product details for each product
        const product = await Product.findById(productId);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product with ID ${productId} not found` });
        }

        // Create and store the order detail for each product
        const newOrder = new Order({
          userID: userId, // Associate with the user ID
          productId: product._id, // Associate with the product ID
          address, // Address from the request
          title: product.title, // Product title
          description: product.description, // Product description
          price: product.price, // Product price
          image: product.image, // Product image
          quantity: quantity || 1, // Quantity (defaults to 1 if not provided)
        });

        orderDetails.push(newOrder); // Add the order detail to the array
      }
    } else {
      // If only one product, process it directly
      const { productId, quantity } = products;

      // Fetch product details
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Create and store the single order
      const newOrder = new Order({
        userID: userId, // Associate with the user ID
        productId: product._id, // Associate with the product ID
        address, // Address from the request
        title: product.title, // Product title
        description: product.description, // Product description
        price: product.price, // Product price
        image: product.image, // Product image
        quantity: quantity || 1, // Quantity (defaults to 1 if not provided)
      });

      orderDetails.push(newOrder); // Add the single order to the array
    }

    // Save all the orders (whether single or multiple) to the database
    await Order.insertMany(orderDetails);

    // Respond with success and order details
    res
      .status(201)
      .json({ message: "Order(s) placed successfully", orders: orderDetails });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
    console.error(error); // Log the error for debugging
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    // Find all orders where the userID matches the provided userId
    const orders = await Order.find({ userID: userId }).populate(
      "productId",
      "title price"
    ); // Populating productId with specific fields

    // If no orders are found, return a 404 response
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Respond with the found orders
    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
    console.error(error); // Log the error for debugging
  }
};

// module.exports = { getOrdersByUserId };

module.exports = { addToOrder, getOrdersByUserId };
