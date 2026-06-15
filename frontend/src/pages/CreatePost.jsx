import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PenTool, ArrowLeft, Send } from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Route protection
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required');
      return;
    }

    setLoading(true);
    try {
      await api.posts.create(title.trim(), content.trim());
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '25px' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'hsl(var(--text-secondary))',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </Link>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsla(var(--accent-primary) / 0.15) 0%, hsla(var(--accent-secondary) / 0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(var(--accent-primary))'
          }}>
            <PenTool size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem' }}>Create a New Post</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>
              Publish your articles, tutorials, or developer insights
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label className="form-label" htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              required
              maxLength={200}
              className="form-input"
              placeholder="e.g. Mastering React Context API with Custom Hooks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: '1.1rem', fontWeight: 600 }}
            />
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
              {title.length}/200 characters
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label className="form-label" htmlFor="content">Content</label>
            <textarea
              id="content"
              required
              className="form-input form-textarea"
              placeholder="Write your markdown or text content here. Share your code blocks, explanations, and key takeaways..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                lineHeight: '1.7',
                fontSize: '1rem',
                minHeight: '300px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '130px' }}
            >
              {loading ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
