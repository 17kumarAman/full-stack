const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to verify JWT token
const authorize = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization header missing' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ msg: 'Invalid authorization format' });
  }

  try {
    const decoded = jwt.verify(token, '123kjsanfdjn'); // Use your secret key
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = authorize;
