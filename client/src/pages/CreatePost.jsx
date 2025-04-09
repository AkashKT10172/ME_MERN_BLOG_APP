import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setUploading(false);
      return res.data.secure_url;
    } catch (error) {
      setUploading(false);
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';
    if (imageFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return;
    }

    try {
      await axios.post(
        'https://me-mern-blog-app.onrender.com/api/posts',
        {
          title,
          content,
          tags: tags.split(','),
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div className="container mt-5" style={{ color: 'var(--text)' }}>
      <div
        className="card p-4 shadow"
        style={{ backgroundColor: 'var(--card-bg)', border: 'none' }}
      >
        <h2 className="mb-4" style={{ color: 'var(--primary)' }}>
          Create Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#000',
            }}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
