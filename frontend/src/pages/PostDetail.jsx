import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Eye, Heart, MessageSquare, ArrowLeft, Calendar, BarChart3, Send } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Likes local state
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Comments local state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.posts.getOne(id);
        setPost(data);
        setLikesCount(data.likes?.length || 0);
        setComments(data.comments || []);
        
        if (user && data.likes) {
          const userHasLiked = data.likes.some(likeId => 
            (likeId._id || likeId) === user._id
          );
          setIsLiked(userHasLiked);
        }
      } catch (err) {
        setError(err.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await api.analytics.like(id);
      setLikesCount(result.likes);
      setIsLiked(result.liked);
    } catch (err) {
      console.error('Error toggling like:', err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentError('');
    setCommenting(true);
    try {
      const updatedComments = await api.analytics.comment(id, newComment.trim());
      setComments(updatedComments);
      setNewComment('');
    } catch (err) {
      setCommentError(err.message || 'Failed to submit comment');
    } finally {
      setCommenting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTopColor: 'hsl(var(--accent-primary))',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: 'hsl(var(--text-secondary))' }}>Loading post content...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 20px auto' }}>
          <span>{error || 'Post not found'}</span>
        </div>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '850px', paddingBottom: '100px' }}>
      {/* Navigation Headers */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px'
      }}>
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

        {isAuthenticated && (
          <Link to={`/posts/${post._id}/stats`} className="btn btn-secondary" style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            borderColor: 'hsla(var(--accent-cyan)/0.3)',
            color: 'hsl(var(--accent-cyan))'
          }}>
            <BarChart3 size={16} />
            <span>Post Analytics</span>
          </Link>
        )}
      </div>

      {/* Main Post Panel */}
      <article className="glass-panel animate-fade-in" style={{ padding: '40px 50px', marginBottom: '40px' }}>
        {/* Title */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '20px',
          lineHeight: '1.25',
          background: 'linear-gradient(135deg, #fff 60%, hsl(var(--accent-primary)) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>{post.title}</h1>

        {/* Metadata */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '20px',
          fontSize: '0.85rem',
          color: 'hsl(var(--text-secondary))',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '25px',
          marginBottom: '35px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, hsl(var(--accent-primary)) 0%, hsl(var(--accent-secondary)) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {post.author?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
              {post.author?.username || 'Anonymous'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>{formatDate(post.createdAt)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Eye size={14} />
              <span>{post.views || 0} views</span>
            </span>
          </div>
        </div>

        {/* Post Content Body */}
        <div style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: 'hsl(var(--text-primary))',
          whiteSpace: 'pre-wrap',
          letterSpacing: '-0.01em',
        }}>
          {post.content}
        </div>

        {/* Interactions Row */}
        <div style={{
          marginTop: '50px',
          paddingTop: '25px',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleLike}
            className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Heart size={18} style={{ fill: isLiked ? 'currentColor' : 'none' }} />
            <span>{isLiked ? 'Liked' : 'Like Post'}</span>
            <span style={{
              background: isLiked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
              padding: '1px 8px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              marginLeft: '4px'
            }}>{likesCount}</span>
          </button>

          <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
            Join the conversation below
          </span>
        </div>
      </article>

      {/* Comments section */}
      <section className="glass-panel" style={{ padding: '40px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} style={{ color: 'hsl(var(--accent-primary))' }} />
          <span>Comments ({comments.length})</span>
        </h3>

        {/* Add comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '40px' }}>
            {commentError && (
              <div className="alert alert-error" style={{ padding: '8px 12px', marginBottom: '15px' }}>
                <span>{commentError}</span>
              </div>
            )}
            <div className="form-group" style={{ position: 'relative' }}>
              <textarea
                required
                className="form-input"
                style={{
                  minHeight: '80px',
                  borderRadius: 'var(--radius-md)',
                  paddingRight: '60px',
                  backgroundColor: 'rgba(5, 8, 16, 0.4)'
                }}
                placeholder="Share your thoughts on this post..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="btn btn-primary"
                style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '10px',
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  borderRadius: '50%'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--glass-border)',
            textAlign: 'center',
            marginBottom: '40px',
            backgroundColor: 'rgba(255,255,255,0.01)'
          }}>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
              Please <Link to="/login" style={{ color: 'hsl(var(--accent-primary))', fontWeight: 600 }}>login</Link> to write a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'hsl(var(--text-muted))', padding: '20px 0' }}>
            No comments yet. Be the first to start the discussion!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'hsl(var(--accent-cyan))'
                  }}>
                    {comment.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
                    {comment.user?.username || 'Anonymous'}
                  </span>
                  <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.75rem' }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: 'hsl(var(--text-secondary))',
                  whiteSpace: 'pre-wrap'
                }}>{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PostDetail;
