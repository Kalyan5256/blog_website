import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    logout();
    navigate('/');
  };
 
  return (
    <nav className="navbar">
      <Link to="/" className="logo">MyBlog</Link>
 
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/create">Create Post</Link>
            <Link to="/dashboard">Dashboard</Link>
            <span className="username">Hi, {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
 
export default Navbar;
