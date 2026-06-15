import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Eye, Heart, MessageSquare, ArrowLeft, BarChart3, TrendingUp, Calendar, User } from 'lucide-react';

const StatsDashboard = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.analytics.getStats(id);
        setStats(data);
      } catch (err) {
        setError(err.message || 'Stats could not be loaded');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
          borderTopColor: 'hsl(var(--accent-cyan))',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: 'hsl(var(--text-secondary))' }}>Generating analytics dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 20px auto' }}>
          <span>{error || 'Stats not available'}</span>
        </div>
        <Link to={`/posts/${id}`} className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Post</span>
        </Link>
      </div>
    );
  }

  // engagement calculation
  const totalInteractions = stats.totalLikes + stats.totalComments;
  const engagementRate = stats.views > 0 
    ? ((totalInteractions / stats.views) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="container" style={{ maxWidth: '900px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link to={`/posts/${id}`} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'hsl(var(--text-secondary))',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <ArrowLeft size={16} />
          <span>Back to Article</span>
        </Link>
      </div>

      {/* Dashboard Title Header */}
      <div className="glass-panel animate-fade-in" style={{ padding: '30px 40px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, hsla(var(--accent-cyan) / 0.15) 0%, hsla(var(--accent-primary) / 0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(var(--accent-cyan))',
            boxShadow: '0 0 15px hsla(var(--accent-cyan)/0.1)'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Analytics Overview</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>
              Performance stats for: <span style={{ color: '#fff', fontWeight: 600 }}>{stats.title}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Card: Views */}
        <div className="glass-card animate-fade-in delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>Views</span>
            <Eye size={20} style={{ color: 'hsl(var(--accent-cyan))' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.views}</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Lifetime article views</span>
          </div>
        </div>

        {/* Card: Likes */}
        <div className="glass-card animate-fade-in delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>Likes</span>
            <Heart size={20} style={{ color: 'hsl(var(--accent-secondary))' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalLikes}</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Reader appreciations</span>
          </div>
        </div>

        {/* Card: Comments */}
        <div className="glass-card animate-fade-in delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>Comments</span>
            <MessageSquare size={20} style={{ color: 'hsl(var(--accent-primary))' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalComments}</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Active discussions</span>
          </div>
        </div>

        {/* Card: Engagement Rate */}
        <div className="glass-card animate-fade-in delay-4" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>Engagement</span>
            <TrendingUp size={20} style={{ color: 'hsl(var(--success))' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{engagementRate}%</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Interactions per view</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Details Block */}
      <div className="glass-panel animate-fade-in delay-5" style={{ padding: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '25px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
          Performance Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* View Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
              <span style={{ color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Interaction Distribution</span>
              <span style={{ color: 'hsl(var(--text-muted))' }}>{totalInteractions} interactions</span>
            </div>
            
            {/* Visual breakdown bar */}
            <div style={{
              height: '14px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              border: '1px solid var(--glass-border)'
            }}>
              {totalInteractions > 0 ? (
                <>
                  <div style={{
                    width: `${(stats.totalLikes / totalInteractions) * 100}%`,
                    background: 'linear-gradient(to right, hsl(var(--accent-secondary)), hsl(var(--accent-primary)))',
                    height: '100%'
                  }} title={`Likes: ${stats.totalLikes}`} />
                  <div style={{
                    width: `${(stats.totalComments / totalInteractions) * 100}%`,
                    backgroundColor: 'hsl(var(--accent-cyan))',
                    height: '100%'
                  }} title={`Comments: ${stats.totalComments}`} />
                </>
              ) : (
                <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', height: '100%' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'hsl(var(--accent-secondary))' }} />
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Likes ({stats.totalLikes})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'hsl(var(--accent-cyan))' }} />
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Comments ({stats.totalComments})</span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div style={{
            marginTop: '15px',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              padding: '12px 20px',
              borderBottom: '1px solid var(--glass-border)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'hsl(var(--text-secondary))'
            }}>
              <span>Metric</span>
              <span>Value</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                <span style={{ color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={14} style={{ color: 'hsl(var(--accent-cyan))' }} /> Author
                </span>
                <span style={{ fontWeight: 600 }}>{stats.author}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                <span style={{ color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} style={{ color: 'hsl(var(--accent-cyan))' }} /> Created Date
                </span>
                <span>{formatDate(stats.createdAt)}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px 20px', fontSize: '0.9rem' }}>
                <span style={{ color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={14} style={{ color: 'hsl(var(--accent-cyan))' }} /> Engagement Rating
                </span>
                <span style={{
                  fontWeight: 700,
                  color: parseFloat(engagementRate) > 15 ? 'hsl(var(--success))' : 'hsl(var(--accent-secondary))'
                }}>
                  {parseFloat(engagementRate) > 15 ? 'High Performance' : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
