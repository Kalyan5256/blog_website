import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
 
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]     = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchMyStats = async () => {
      try {
        // 1. Get all posts
        const allPosts = await axiosInstance.get('/posts');
 
        // 2. Keep only posts written by the logged-in user
        const myPosts = allPosts.data.filter(
          (post) => post.author?.username === user.username
        );
 
        // 3. Fetch detailed stats for each of my posts
        const statsPromises = myPosts.map((post) =>
          axiosInstance.get(`/analytics/${post._id}/stats`)
        );
 
        const statsResults = await Promise.all(statsPromises);
        setStats(statsResults.map((res) => res.data));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchMyStats();
  }, [user]);
 
  if (loading) return <p>Loading dashboard...</p>;
 
  if (stats.length === 0) {
    return <p>You haven't written any posts yet.</p>;
  }
 
  return (
    <div className="dashboard">
      <h2>My Post Analytics</h2>
 
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, index) => (
            <tr key={index}>
              <td>{s.title}</td>
              <td>{s.views}</td>
              <td>{s.totalLikes}</td>
              <td>{s.totalComments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
 
export default Dashboard;
