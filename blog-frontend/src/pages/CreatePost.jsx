import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
 
const CreatePost = () => {
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading]   = useState(false);
 
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      const res = await axiosInstance.post('/posts', { title, content });
      // res.data = the newly created post, including its _id
      navigate(`/post/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="form-page">
      <h2>Write a New Post</h2>
 
      {error && <p className="error-text">{error}</p>}
 
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
 
        <textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        />
 
        <button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};
 
export default CreatePost;
