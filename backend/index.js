const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware
const auth = require("./router/auth");
const product = require('./router/products');
const cart = require('./router/cart');
const order = require('./router/order');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Custom CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174'], // Ensure this matches your Vue app's URL without trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow DELETE and PUT methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Allow necessary headers
  credentials: true, // Allow credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));


const URI = "mongodb+srv://Aman:BhV3c3VN1N56nvqm@cluster0.mm1ukpv.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start the server explicitly on port 4000
    app.listen(4000, () => console.log("Server is running on port 4000"));
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Route for user registration
app.use("/api", auth);
app.use("/", product);
app.use("/", order);
app.use("/", cart);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});
