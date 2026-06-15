// routes/postRoutes.js
const express      = require('express');
const router       = express.Router();
const { getPosts, getPost, createPost } = require('../controllers/postController');
const protect      = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
 
//  GET  /api/posts       — public (no auth required)
router.get('/',     getPosts);
 
//  GET  /api/posts/:id   — public but optionalAuth increments view
router.get('/:id',  optionalAuth, getPost);
 
//  POST /api/posts       — registered users only
router.post('/',    protect, createPost);
 
module.exports = router;
