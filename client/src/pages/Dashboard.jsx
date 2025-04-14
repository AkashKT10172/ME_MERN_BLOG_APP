// CRIO_SOLUTION_START_MODULE_ONE
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get('https://me-mern-blog-app.onrender.com/api/users/me/posts', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      }
    };

    fetchMyPosts();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`https://me-mern-blog-app.onrender.com/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--text)' }}>My Posts</h2>
        <button
          className="btn"
          onClick={() => navigate('/create')}
          style={{ backgroundColor: 'var(--primary)', color: '#000' }}
        >
          + Create Post
        </button>
      </div>

      <div className="row">
        {posts.map((post) => (
          <div className="col-md-6 col-lg-4 mb-4" key={post._id}>
            <div
              className="card h-100 shadow"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text)' }}
            >
              {post.image && (
                <img
                  src={post.image}
                  className="card-img-top"
                  alt="Post"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text text" style={{ color: 'var(--muted)' }}>
                  ❤️ {post.likes?.length || 0} | 💬 {post.commentCount || 0}
                </p>

                <div className="mt-auto d-flex gap-2">
                  <Link
                    to={`/posts/${post._id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit/${post._id}`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>You have no posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
// CRIO_SOLUTION_END_MODULE_ONE
