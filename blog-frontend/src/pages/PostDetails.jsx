import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
 
const PostDetails = () => {
  const { id } = useParams();      // grabs ':id' from the URL
  const { user } = useAuth();      // null if guest
 
  const [post, setPost]       = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
 
  // Load the post when the page opens
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchPost();
  }, [id]); // re-run if the :id in the URL changes
 
  // Handle Like button click
  const handleLike = async () => {
    try {
      const res = await axiosInstance.put(`/analytics/${id}/like`);
      // res.data = { likes: <number>, liked: true/false }
      setPost((prev) => ({ ...prev, likes: new Array(res.data.likes) }));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };
 
  // Handle Comment form submit
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
 
    try {
      const res = await axiosInstance.post(`/analytics/${id}/comment`, {
        text: commentText,
      });
      // res.data = full updated comments array
      setPost((prev) => ({ ...prev, comments: res.data }));
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };
 
  if (loading) return <p>Loading post...</p>;
  if (!post)   return <p>Post not found.</p>;
 
  return (
    <div className="post-details">
      <h2>{post.title}</h2>
      <p className="post-meta">
        By {post.author?.username} · {post.views} views
      </p>
 
      <p className="post-content">{post.content}</p>
 
      {user ? (
        <button onClick={handleLike}>
          ❤️ Like ({post.likes.length})
        </button>
      ) : (
        <p className="info-text">
          {post.likes.length} likes — log in to like this post
        </p>
      )}
 
      <hr />
 
      <h3>Comments ({post.comments.length})</h3>
 
      {post.comments.map((c) => (
        <div className="comment" key={c._id}>
          <strong>{c.user?.username || 'Unknown'}:</strong> {c.text}
        </div>
      ))}
 
      {user ? (
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p className="info-text">Log in to leave a comment</p>
      )}
    </div>
  );
};
 
export default PostDetails;
