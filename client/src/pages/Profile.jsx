import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', avatar: '' });
  const [postCount, setPostCount] = useState(0);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setForm({ name: res.data.name, avatar: res.data.avatar });
        setPostCount(res.data.postCount);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/users/me', form, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      login({ ...user, name: res.data.name, avatar: res.data.avatar });
      alert('Profile updated');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text)' }}
      >
        <div className="text-center mb-4">
          <img
            src={form.avatar}
            alt="Avatar"
            className="rounded-circle border"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
        </div>

        <h4 className="text-center mb-3">{form.name}</h4>
        <p className="text-center text" style={{ color: 'var(--text)' }}>
          {user?.user?.email}
        </p>

        <p className="text-center"><strong>Total Posts:</strong> {postCount}</p>

        <hr style={{ borderColor: 'var(--muted)' }} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--muted)' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Avatar URL</label>
            <input
              name="avatar"
              className="form-control"
              value={form.avatar}
              onChange={handleChange}
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--muted)' }}
            />
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: 'var(--primary)', color: '#000' }}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
