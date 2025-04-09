import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://me-mern-blog-app.onrender.com/api/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '400px', border: 'none' }}>
        <h3 className="mb-4 text-center" style={{ color: 'var(--primary)' }}>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text)' }}>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text)' }}>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
