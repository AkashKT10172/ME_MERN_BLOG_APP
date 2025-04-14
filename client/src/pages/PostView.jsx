// CRIO_SOLUTION_START_MODULE_ONE
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function PostView() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`https://me-mern-blog-app.onrender.com/api/posts/${id}`, {
          headers: user ? { Authorization: `Bearer ${user.token}` } : {}
        });
        const data = {
          ...res.data,
          likes: Array.isArray(res.data.likes) ? res.data.likes : [],
          likedByCurrentUser: !!res.data.likedByCurrentUser,
          tags: Array.isArray(res.data.tags) ? res.data.tags : []
        };
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, user, refreshTrigger]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://me-mern-blog-app.onrender.com/api/posts/${id}/comments`);
        console.log("Comments from API:", res.data);
        const validComments = Array.isArray(res.data) ? res.data.filter(comment => comment) : [];
        setComments(validComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, [id, refreshTrigger]);

  const handleLike = async () => {
    if (!user) return alert('Login to like');
    try {
      await axios.post(
        `https://me-mern-blog-app.onrender.com/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Trigger a complete refresh of the component instead of updating state directly
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleComment = async () => {
    if (!user) return alert('Login to comment');
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `https://me-mern-blog-app.onrender.com/api/posts/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      setNewComment('');
      // Trigger a complete refresh of the component
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (isLoading || !post) return <div className="container mt-5 text-light">Loading...</div>;

  return (
    <div className="container mt-4" style={{ color: 'var(--text)' }}>
      <div className="card p-4 shadow" style={{ backgroundColor: 'var(--card-bg)', border: 'none' }}>
        <h2 className="mb-3" style={{ color: 'var(--primary)' }}>{post.title}</h2>
        {post.image && (
          <img src={post.image} alt="Post" className="mb-3 img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'cover' }} />
        )}
        <p>{post.content}</p>

        {post.tags.length > 0 && (
          <div className="mb-3">
            {post.tags.map((t) => (
              <span key={t} className="badge bg-secondary me-1">#{t}</span>
            ))}
          </div>
        )}

        <button 
          className={`btn ${post.likedByCurrentUser ? 'btn-primary' : 'btn-outline-primary'} mb-4`} 
          onClick={handleLike}
          disabled={!user}
        >
          {post.likedByCurrentUser ? 'Unlike' : 'Like'} ({post.likes.length})
        </button>

        <hr style={{ borderColor: 'var(--muted)' }} />

        <h5 className="mb-3">Comments ({comments.length})</h5>
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((comment, index) => {
            if (!comment) {
              return null;
            }
            
            return (
              <div key={comment._id || `comment-${index}`} className="mb-3 border-bottom pb-2" style={{ borderColor: 'var(--muted)' }}>
                <strong style={{ color: 'var(--primary)' }}>
                  {comment.author && comment.author.name ? comment.author.name : 'Anonymous'}
                </strong>{' '}
                <small className="text">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Unknown date'}
                </small>
                <p className="mb-1">{comment.text || ''}</p>
              </div>
            );
          })
        )}

        {user ? (
          <div className="input-group mt-4">
            <input
              type="text"
              name="comment"
              className="form-control"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleComment}>Add Comment</button>
          </div>
        ) : (
          <p className="text mt-3">Login to leave a comment.</p>
        )}
      </div>
    </div>
  );
}

export default PostView;

// CRIO_SOLUTION_END_MODULE_ONE