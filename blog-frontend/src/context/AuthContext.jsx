import { createContext, useState, useEffect, useContext } from 'react';
 
// 1. Create the context container (empty box for now)
const AuthContext = createContext();
 
// 2. Create a Provider component — wraps the whole app
export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Runs ONCE when the app first loads
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');
 
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
 
  // Called after successful login or register
  const login = (userData) => {
    const { token, ...userInfo } = userData;
 
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
 
    setToken(token);
    setUser(userInfo);
  };
 
  // Called when user clicks Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };
 
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
 
// 3. Custom hook — lets any component easily use this context
export const useAuth = () => useContext(AuthContext);
