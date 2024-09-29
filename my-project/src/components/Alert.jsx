import React, { useEffect } from "react";

const Alert = ({ message, onClose,bg }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close alert after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  return (
    <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-${bg}-500 text-white p-4 rounded-lg shadow-lg z-50`}>
      {message}
      <button onClick={onClose} className={`ml-4 bg-${bg} hover:text-white`}>
        &times;
      </button>
    </div>
  );
};

export default Alert;
