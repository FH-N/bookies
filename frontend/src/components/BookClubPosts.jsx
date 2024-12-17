import React, { useEffect, useState } from "react";
import axios from "axios";

const BookClubPosts = ({ clubId }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  const fetchPosts = () => {
    axios.get(`http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/`),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
        .then((res) => setPosts(res.data))
        .catch((err) => setError("Failed to load posts."));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/`,
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setNewPost("");
        fetchPosts();
      })
      .catch(() => setError("Failed to create post."));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bookclub-posts">
      <h2>Book Club Posts</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handlePostSubmit} className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write your post here..."
          required
        />
        <button type="submit">Post</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <p>
              <strong>{post.author}</strong> at {post.created_at}
            </p>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookClubPosts;
