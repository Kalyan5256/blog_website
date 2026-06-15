// server.js
require('dotenv').config();              // Load .env variables first
 
const express        = require('express');
const cors           = require('cors');
const connectDB      = require('./config/db');
const authRoutes     = require('./routes/authRoutes');
const postRoutes     = require('./routes/postRoutes');
const analyticsRoutes= require('./routes/analyticsRoutes');
 
const app = express();
 
// ── CORS: allow requests from React frontend ────────────
app.use(cors({
  origin:         'http://localhost:3000',
  methods:        ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:    true
}));
 
app.use(express.json()); // parse incoming JSON body
 
// ── ROUTES ─────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/posts',     postRoutes);
app.use('/api/analytics', analyticsRoutes);
 
// Health check
app.get('/', (req, res) => res.send('Blog API is running'));
 
// ── START ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
 
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
