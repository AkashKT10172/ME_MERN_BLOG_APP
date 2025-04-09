import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import debounce from "lodash.debounce";

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [search, setSearch] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");

  // Fetch posts with optional search & tags
  const fetchPosts = async (searchTerm = "", tagsTerm = "") => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (tagsTerm) params.tags = tagsTerm;
      const res = await axios.get("http://localhost:5000/api/posts", {
        params,
      });
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // Debounced version of fetchPosts for search input
  const debouncedFetch = useCallback(debounce(fetchPosts, 500), []);

  // Effect: fetch on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Effect: fetch when search or tags change
  useEffect(() => {
    debouncedFetch(search, tagsFilter);
  }, [search, tagsFilter, debouncedFetch]);

  // Fetch comments for posts
  useEffect(() => {
    const fetchAllComments = async () => {
      const map = {};
      await Promise.all(
        posts.map(async (p) => {
          try {
            const res = await axios.get(
              `http://localhost:5000/api/posts/${p._id}/comments`
            );
            map[p._id] = Array.isArray(res.data) ? res.data : [];
          } catch {
            map[p._id] = [];
          }
        })
      );
      setCommentsByPost(map);
    };
    if (posts.length) fetchAllComments();
  }, [posts]);

  return (
    <div className="container mt-4 ">
      <h2>Explore Posts</h2>

      {/* Search & Filter Inputs */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by tags (comma-separated)"
            value={tagsFilter}
            onChange={(e) => setTagsFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="row">
          {posts.map((post) => {
            const comments = commentsByPost[post._id] || [];

            return (
              // Inside map return
              <div className="col-md-6 col-lg-4 mb-4" key={post._id}>
                <div className="card text-light h-100 shadow-sm border-black">
                  <div className="card-header border-black d-flex align-items-center justify-content-between">
                    <span className="fw-semibold">{post.author.name}</span>
                    <small className="text">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{post.title}</h5>
                    <p className="card-text text">
                      {post.content.slice(0, 100)}...
                    </p>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link
                          to={`/posts/${post._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Read More
                        </Link>

                        <div className="d-flex align-items-center">
                          <span>
                            ❤️{" "}
                            {post.likes?.length || 0}
                          </span>
                          <span className="ms-3 text-info">
                            💬 {comments.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
