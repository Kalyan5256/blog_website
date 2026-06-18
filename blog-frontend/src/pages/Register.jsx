import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
 
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
 
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from refreshing
    setError('');
    setLoading(true);
 
    try {
      await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
      });
 
      // Registration successful — send user to login page
      navigate('/login');
    } catch (err) {
      // Backend sends { message: '...' } on failure
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="form-page">
      <h2>Create an Account</h2>
 
      {error && <p className="error-text">{error}</p>}
 
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
 
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
          minLength={6}
        />
 
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
 
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};
 
export default Register;
