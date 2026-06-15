// middleware/authMiddleware.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');
 
const protect = async (req, res, next) => {
  let token;
 
  // Check if token exists in the Authorization header
  // Header format: 'Bearer eyJhbGci...'
  if (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
 
      // Verify the token — throws error if expired or fake
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');
 
      return next(); // pass control to the next function (the controller)
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid or expired check you device' });
    }
  }
 
  if (!token) {
    return res.status(401).json({ message: 'No token, authorisation denied' });
  }
};
 
module.exports = protect;
