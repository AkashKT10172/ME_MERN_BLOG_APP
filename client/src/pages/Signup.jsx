import { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      form
    );

    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = "";
      if (formData.avatar) {
        avatarUrl = await uploadImageToCloudinary(formData.avatar);
      }

      const response = await axios.post("https://me-mern-blog-app.onrender.com/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: avatarUrl,
      });

      login(response.data);
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '500px', border: 'none' }}>
        <h3 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text)' }}>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text)' }}>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text)' }}>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text)' }}>Avatar (optional)</label>
            <input
              type="file"
              name="avatar"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
            {preview && (
              <div className="text-center mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ height: "100px", width: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
