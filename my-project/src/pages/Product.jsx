import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import Alert from "../components/Alert";
import { selectUser } from "../store/authSlice";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [color, setColor] = useState("");

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/product/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({ id: product._id }));
      setAlertMessage(`${product.title} has been added to your cart!`);
      setColor("blue");
      setShowAlert(true);
    } else {
      setAlertMessage("Please login to add the item to your cart.");
      setColor("red");
      setShowAlert(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto text-center p-16 text-5xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-80 max-w-md object-cover rounded"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-2xl text-green-600 mb-4">${product.price}</p>
            <p className="text-lg mb-6">{product.description}</p>
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showAlert && (
        <Alert
          message={alertMessage}
          bg={color}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

export default Product;
