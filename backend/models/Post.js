// models/Post.js
const mongoose = require('mongoose');
 
const commentSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:    { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});
 
const postSchema = new mongoose.Schema({
  title: {
    type:     String,
    required: [true, 'Post title is required'],
    trim:     true,
    maxlength: 200
  },
  content: {
    type:     String,
    required: [true, 'Post content is required']
  },
  author: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true
  },
 
  // ── Analytics fields ──────────────────────────
  views:    { type: Number, default: 0 },
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
 
  published: { type: Boolean, default: true }
}, { timestamps: true });
 
module.exports = mongoose.model('Post', postSchema);
