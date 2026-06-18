import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
 
const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
 
  const { login } = useAuth();
  const navigate  = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
 
      // res.data = { _id, username, email, token }
      login(res.data);   // save to AuthContext + localStorage
      navigate('/');     // go to Home page
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="form-page">
      <h2>Login</h2>
 
      {error && <p className="error-text">{error}</p>}
 
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
 
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
 
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
 
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};
 
export default Login;
