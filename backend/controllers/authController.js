// controllers/authController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');
 
// Helper: generate a signed JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
 
// ── REGISTER ──────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  const { username, email, password } = req.body;
 
  // 1. Check for missing fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
 
  // 2. Check if email already registered
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'Email already in use' });
  }
 
  // 3. Create user (password is hashed automatically by User model)
  const user = await User.create({ username, email, password });
 
  // 4. Return user info + token
  res.status(201).json({
    _id:      user._id,
    username: user.username,
    email:    user.email,
    token:    generateToken(user._id)
  });
};
 
// ── LOGIN ─────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
 
  const user = await User.findOne({ email });
 
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id:      user._id,
      username: user.username,
      email:    user.email,
      token:    generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
 
module.exports = { register, login };
