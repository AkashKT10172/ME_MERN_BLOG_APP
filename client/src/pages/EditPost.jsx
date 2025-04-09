import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function EditPost() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setTags(res.data.tags.join(', '));
        setImage(res.data.image);
      } catch (err) {
        alert('Post not found');
        navigate('/dashboard');
      }
    };

    fetchPost();
  }, [id, navigate]);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );

    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = image;

    if (newImageFile) {
      try {
        imageUrl = await uploadToCloudinary(newImageFile);
      } catch (err) {
        setLoading(false);
        alert('Image upload failed');
        return;
      }
    }

    const updatedData = {
      title,
      content,
      tags: tags.split(',').map((tag) => tag.trim()),
      image: imageUrl,
    };

    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ color: 'var(--text)' }}>
      <div
        className="card p-4 shadow"
        style={{ backgroundColor: 'var(--card-bg)', border: 'none' }}
      >
        <h2 style={{ color: 'var(--primary)' }}>Edit Post</h2>
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
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

          {image && (
            <div className="mb-3">
              <label className="form-label">Current Image</label>
              <div>
                <img
                  src={image}
                  alt="Current"
                  style={{ height: '120px', borderRadius: '8px', objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Upload New Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setNewImageFile(e.target.files[0])}
            />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
