// middleware/optionalAuth.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');
 
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')) {
    try {
      const token   = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Invalid token — just treat user as guest, do NOT block
      req.user = null;
    }
  }
  next(); // ALWAYS continue — guests are welcome
};
 
module.exports = optionalAuth;
