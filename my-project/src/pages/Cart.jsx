import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateQuantity, removeCart, deleteCart } from "../store/cartSlice";
import { selectUser } from "../store/authSlice";

export const Cart = () => {
  const dispatch = useDispatch();
  const { cart, error } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const user = useSelector(selectUser);


  useEffect(() => {
    dispatch(getCart());
if(!user){
  return navigate('/')
}
    // Navigate to home if there's an error or the cart is empty
    
  }, [dispatch]);

  const handleUpdateQuantity = (productId, action) => {
    dispatch(updateQuantity({ productId, action }));
  };

  const removeFromCart = (productId) => {
    dispatch(removeCart({ id: productId }));
  };

  if (error) {
    return <div className="text-red-500 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Shopping Cart</h1>

      {cart.length > 0 ? (
        <>
          <ul className="border border-gray-200 rounded-lg shadow-lg">
            {cart.map((item, index) => (
              <li
                key={`${item.productId._id}-${index}`}
                className="flex justify-between items-center p-4 border-b last:border-b-0"
              >
                <img
                  src={item.productId.image}
                  alt={item.productId.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 ml-4">
                  <h2 className="font-medium">{item.productId.title}</h2>
                  <p className="text-gray-600">
                    ${item.productId.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, "decrease")}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, "increase")}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId._id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => {
                dispatch(deleteCart());
                navigate("/");
              }}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              Delete Cart
            </button>
            <div className="text-lg">
              Total: $
              {cart.reduce(
                (total, item) => total + item.productId.price * item.quantity,
                0
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-6">Your cart is empty.</div>
      )}
    </div>
  );
};
