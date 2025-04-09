import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://me-mern-blog-app.onrender.com/api/posts', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchPosts();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`https://me-mern-blog-app.onrender.com/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setPosts(prev => prev.filter(post => post._id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="container mt-5" style={{ color: 'var(--text)' }}>
      <div
        className="card p-4 shadow"
        style={{ backgroundColor: 'var(--card-bg)', border: 'none' }}
      >
        <h2 className="mb-4" style={{ color: 'var(--primary)' }}>
          Admin Panel – All Posts
        </h2>

        <div className="table-responsive">
          <table className="table table-dark table-bordered align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Likes</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.author?.name || 'N/A'}</td>
                  <td>{post.likes?.length || 0}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => navigate(`/posts/${post._id}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
