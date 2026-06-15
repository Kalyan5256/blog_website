// controllers/postController.js
const Post = require('../models/Post');
 
// ── GET ALL POSTS (everyone can read) ─────────────────────
const getPosts = async (req, res) => {
  const posts = await Post.find({ published: true })
    .populate('author', 'username')   // replace ObjectId with username
    .sort({ createdAt: -1 })          // newest first
    .select('title author views likes comments createdAt'); // send only needed fields
 
  res.json(posts);
};
 
// ── GET SINGLE POST (everyone, but count view) ────────────
const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username')
    .populate('comments.user', 'username');
 
  if (!post) return res.status(404).json({ message: 'Post not found' });
 
  // Increment view count
  post.views += 1;
  await post.save();
 
  res.json(post);
};
 
// ── CREATE POST (registered users only) ───────────────────
const createPost = async (req, res) => {
  const { title, content } = req.body;
 
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
 
  const post = await Post.create({
    title,
    content,
    author: req.user._id   // req.user is set by protect middleware
  });
 
  res.status(201).json(post);
};
 
module.exports = { getPosts, getPost, createPost };
