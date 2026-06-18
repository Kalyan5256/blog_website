import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
 
const Home = () => {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchPosts();
  }, []); // empty array = run once when the page loads
 
  if (loading) return <p>Loading posts...</p>;
 
  if (posts.length === 0) return <p>No posts yet. Be the first to write one!</p>;
 
  return (
    <div className="post-list">
      <h2>Latest Posts</h2>
 
      {posts.map((post) => (
        <div className="post-card" key={post._id}>
          <Link to={`/post/${post._id}`}>
            <h3>{post.title}</h3>
          </Link>
 
          <p className="post-meta">
            By {post.author?.username || 'Unknown'} · {post.views} views ·{' '}
            {post.likes.length} likes · {post.comments.length} comments
          </p>
        </div>
      ))}
    </div>
  );
};
 
export default Home;
