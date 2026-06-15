import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Eye, Heart, MessageSquare, Search, PlusCircle, Calendar, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.posts.getAll();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        setError('Could not retrieve posts. Make sure backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const results = posts.filter(post => 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.author?.username?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPosts(results);
  }, [search, posts]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Hero Header */}
      <div style={{
        textAlign: 'center',
        padding: '60px 0 40px 0',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #fff 30%, hsl(var(--accent-secondary)) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '15px',
          letterSpacing: '-0.04em'
        }}>
          Explore Dev Stories & Code
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'hsl(var(--text-secondary))',
          maxWidth: '600px',
          margin: '0 auto 30px auto',
          fontWeight: 500
        }}>
          A tech-focused hub where creators compile thoughts, stats, comments and share experiences with developers globally.
        </p>

        {/* Search Panel */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '500px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'hsl(var(--text-muted))'
          }} />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '48px',
              borderRadius: '30px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(10, 15, 30, 0.6)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
            placeholder="Search titles or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTopColor: 'hsl(var(--accent-primary))',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ marginTop: '20px', color: 'hsl(var(--text-secondary))' }}>Loading articles...</p>
        </div>
      ) : (
        <>
          {filteredPosts.length === 0 ? (
            <div className="glass-panel" style={{
              textAlign: 'center',
              padding: '60px 40px',
              maxWidth: '650px',
              margin: '40px auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <h3 style={{ fontSize: '1.5rem' }}>No posts found</h3>
              <p style={{ color: 'hsl(var(--text-secondary))' }}>
                {search ? "We couldn't find any blogs matching your search keyword." : "There are currently no published blog posts in the system."}
              </p>
              {isAuthenticated ? (
                <Link to="/create" className="btn btn-primary">
                  <PlusCircle size={18} />
                  <span>Create the First Post</span>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  <span>Sign in to write a post</span>
                </Link>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '28px',
              marginTop: '20px'
            }}>
              {filteredPosts.map((post, idx) => (
                <article
                  key={post._id}
                  className={`glass-card animate-fade-in delay-${(idx % 5) + 1}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '260px'
                  }}
                >
                  <div>
                    {/* Header: Author & Date */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: 'hsl(var(--text-secondary))',
                      marginBottom: '15px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                          {post.author?.username?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{post.author?.username || 'Anonymous'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1.35rem',
                      marginBottom: '12px',
                      fontWeight: 700,
                      lineHeight: 1.3
                    }}>
                      <Link to={`/posts/${post._id}`} style={{
                        color: 'hsl(var(--text-primary))',
                      }} onMouseOver={(e) => e.target.style.color = 'hsl(var(--accent-primary))'} onMouseOut={(e) => e.target.style.color = 'hsl(var(--text-primary))'}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>

                  {/* Footer Stats & CTA */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '15px',
                    marginTop: '15px'
                  }}>
                    {/* Indicators */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span className="stats-badge" title="Views">
                        <Eye />
                        <span>{post.views || 0}</span>
                      </span>
                      <span className="stats-badge" title="Likes">
                        <Heart style={{ fill: post.likes?.length > 0 ? 'hsla(var(--accent-secondary)/0.2)' : 'none' }} />
                        <span>{post.likes?.length || 0}</span>
                      </span>
                      <span className="stats-badge" title="Comments">
                        <MessageSquare />
                        <span>{post.comments?.length || 0}</span>
                      </span>
                    </div>

                    {/* Read more */}
                    <Link to={`/posts/${post._id}`} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'hsl(var(--accent-cyan))'
                    }} onMouseOver={(e) => e.target.style.transform = 'translateX(3px)'} onMouseOut={(e) => e.target.style.transform = 'none'}>
                      <span>Read</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
