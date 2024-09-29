import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { register } from "../store/authSlice"; // Redux slice se register action ko import kiya hai
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, isLoading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "1212",
  });

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form, // Correctly updating the form state
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form)); // Dispatching the form data correctly
  };

  useEffect(() => {
    if (user) return navigate("/");
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>

        {/* Display error message if registration fails */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {/* Welcome message for successful registration */}
        {user && (
          <p className="mt-4 text-green-600 text-center">
            Welcome, {user.username}!
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
