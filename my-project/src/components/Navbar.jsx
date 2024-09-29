import React, { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../store/authSlice"; 
import { getCart } from "../store/cartSlice"; 

function Navbar() {
  const user = useSelector(selectUser); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout()); 
    return navigate('/')
  };

  useEffect(() => {
    dispatch(getCart()); 
  }, [dispatch]);

  return (
    <div className="bg-slate-600 p-3">
      <nav className="flex justify-between px-8 items-center">
      
        <div className="text-2xl font-bold">
        <Link to="/" className="text-white "> <h1 className="text-5xl">Logo</h1></Link>
        </div>

        <ul className="flex gap-4 items-center">
          {user ? (
            <>
              <li className="text-white font-medium">Welcome, {user.username}</li>

              
              <li>
                <Link to="/" className="text-white hover:underline">
                  Home
                </Link>
              </li>

              {/* Cart Link */}
              <li>
                <Link to="/cart" className="text-white hover:underline">
                  Cart
                </Link>
              </li>

              {/* Logout Button */}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 p-2 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Login Link */}
              <li>
                <Link to="/login" className="text-white hover:underline">
                  Login
                </Link>
              </li>

              {/* Register Link */}
              <li>
                <Link to="/register" className="text-white hover:underline">
                  Register
                </Link>
              </li>

              {/* Message to Log In */}
              <li className="text-white font-medium">Please log in</li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
