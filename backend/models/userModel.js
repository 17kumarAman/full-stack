const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Define userSchema with timestamps for user document
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true } // This applies to the entire User document
);

// Token generation logic remains the same
userSchema.methods.generateToken = function () {
  const payload = { id: this._id, email: this.email };
  const token = jwt.sign(payload, "123kjsanfdjn", { expiresIn: "1h" });
  return token;
};

// Middleware to update `updatedAt` for user when the cart is modified
userSchema.pre("save", function (next) {
  this.updatedAt = new Date(); // Update user schema's `updatedAt`
  next();
});

module.exports = mongoose.model("User", userSchema);
