import React, { useEffect, useState } from "react";
import axios from "axios";

const BookClubPosts = ({ clubId }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  const fetchPosts = () => {
    axios
      .get(`http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => setError("Failed to load posts."));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Book Club Posts
      </h2>
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-4">{error}</div>
      )}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          >
            <p className="text-sm text-gray-600 mb-2">
              <strong>{post.author}</strong> at{" "}
              <span className="text-gray-400">{post.created_at}</span>
            </p>
            <div className="mb-4">
              {post.post_tags && post.post_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.post_tags.map((post_tag) => (
                    <span
                      key={post_tag.id}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {post_tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No tags available</p>
              )}
            </div>
            <p className="text-lg">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookClubPosts;
