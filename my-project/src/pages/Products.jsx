import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, getCart } from "../store/cartSlice";
import Alert from "../components/Alert";
import { selectUser } from "../store/authSlice";

function Products() {
  const [products, setProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [color, setColor] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios("http://localhost:4000/products");
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProducts();
    dispatch(getCart());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addToCart({ id: product._id }));
      setAlertMessage(`${product.title} has been added to your cart!`);
      setColor('blue');
      setShowAlert(true);
    } else {
      setAlertMessage("Please login to add an item to the cart.");
      setColor('red');
      setShowAlert(true);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Products List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow-lg">
            <img
              src={product.image}
              alt={product.title}
              className="w-48 h-48 object-cover mb-4 mx-auto rounded"
            />
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-lg font-medium text-gray-700 mb-4">${product.price}</p>
            <div className="flex justify-between items-center">
              <Link
                to={`/product/${product._id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAlert && (
        <Alert message={alertMessage} bg={color} onClose={() => setShowAlert(false)} />
      )}
    </>
  );
}

export default Products;
