const User = require("../models/userModel");

function userResponse(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    console.log("Request Body:", req.body);

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if the user already exists by email
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Create a new user
    const userCreated = await User.create({ username, email, phone, password });

    // Generate a JWT token for the newly created user
    const token = userCreated.generateToken();
    // localStorage.setItem("User", userCreated);
    // localStorage.setItem("token", token);

    res.status(201).json({
      msg: "Registration Successful",
      token: token,
      user: userResponse(userCreated),
    });
  } catch (error) {
    console.error("Error during user registration:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ msg: "Invalid input data" });
    }

    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists by email
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the plain text password in the database
    if (password !== userExist.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the password matches, generate a JWT token
    const token = userExist.generateToken();
    res.status(200).json({
      message: "Login Successful",
      token: token,
      user: userResponse(userExist),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, phone, password } = req.body;

    // Validate input data
    if (!username || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user exists
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, phone, password }, // Pass only the fields you want to update
      { new: true, runValidators: true } // Returns the updated document
    );

    res.status(200).json({
      msg: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

const users = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json({
      msg: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
};

const singleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

module.exports = { register, login, updateUser, deleteUser, users, singleUser };
