const API_BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  auth: {
    login: (email, password) => 
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (username, email, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
  },
  posts: {
    getAll: () => request('/posts'),
    getOne: (id) => request(`/posts/${id}`),
    create: (title, content) =>
      request('/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      }),
  },
  analytics: {
    like: (id) =>
      request(`/analytics/${id}/like`, {
        method: 'PUT',
      }),
    comment: (id, text) =>
      request(`/analytics/${id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    getStats: (id) => request(`/analytics/${id}/stats`),
  },
};
