// routes/analyticsRoutes.js
const express  = require('express');
const router   = express.Router();
const protect  = require('../middleware/authMiddleware');
const { likePost, addComment, getAnalytics } = require('../controllers/analyticsController');
 
// All analytics routes require login
router.put( '/:id/like',    protect, likePost);
router.post('/:id/comment', protect, addComment);
router.get( '/:id/stats',   protect, getAnalytics);
 
module.exports = router;
