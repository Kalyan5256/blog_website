import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, PlusCircle, LogOut, User, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '0 0 40px 0',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      backgroundColor: 'rgba(10, 15, 30, 0.7)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 800,
          fontSize: '1.4rem',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, hsl(var(--accent-primary)) 0%, hsl(var(--accent-cyan)) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          <BookOpen style={{ color: 'hsl(var(--accent-cyan))', width: '24px', height: '24px' }} />
          <span>DevStream</span>
        </Link>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'hsl(var(--text-secondary))',
            padding: '6px 12px',
          }} className="btn-ghost" onMouseOver={(e) => e.target.style.color = 'hsl(var(--text-primary))'} onMouseOut={(e) => e.target.style.color = 'hsl(var(--text-secondary))'}>
            Feed
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <PlusCircle size={16} />
                <span>Write</span>
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, hsl(var(--accent-primary)) 0%, hsl(var(--accent-secondary)) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#fff',
                    boxShadow: '0 0 10px hsla(var(--accent-primary) / 0.3)'
                  }}>
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
                    {user?.username}
                  </span>
                </div>

                <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '6px 8px' }} title="Sign Out">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
