const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateUser,
  deleteUser,
  users,
  singleUser,
} = require("../controllers/authControllers");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/users").get(users);

router
  .route("/user/:id")
  .get(singleUser)
  .put(updateUser) // Update user details
  .delete(deleteUser); // Delete user

module.exports = router;
