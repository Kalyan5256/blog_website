// controllers/analyticsController.js
const Post = require('../models/Post');
 
// ── LIKE / UNLIKE a post (toggle) ─────────────────────────
const likePost = async (req, res) => {
  const post   = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
 
  const userId   = req.user._id.toString();
  const alreadyLiked = post.likes.map(id => id.toString()).includes(userId);
 
  if (alreadyLiked) {
    // Unlike — remove userId from likes array
    post.likes = post.likes.filter(id => id.toString() !== userId);
  } else {
    // Like — add userId to likes array
    post.likes.push(req.user._id);
  }
 
  await post.save();
  res.json({ likes: post.likes.length, liked: !alreadyLiked });
};
 
// ── ADD COMMENT ───────────────────────────────────────────
const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text required' });
 
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
 
  post.comments.push({ user: req.user._id, text });
  await post.save();
 
  // Return comment with username populated
  const updated = await Post.findById(req.params.id)
    .populate('comments.user', 'username');
 
  res.status(201).json(updated.comments);
};
 
// ── ANALYTICS SUMMARY for a post (registered users only) ──
const getAnalytics = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author','username');
  if (!post) return res.status(404).json({ message: 'Post not found' });
 
  res.json({
    title:         post.title,
    author:        post.author.username,
    views:         post.views,
    totalLikes:    post.likes.length,
    totalComments: post.comments.length,
    createdAt:     post.createdAt
  });
};
 
module.exports = { likePost, addComment, getAnalytics };
