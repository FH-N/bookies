import React, { useEffect, useState } from "react";
import axios from "axios";
import BookClubPost from "./BookClubPost";

const BookClubPostsList = ({ clubId }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const token = localStorage.getItem("access");

  const fetchPosts = () => {
    setLoading(true); // Set loading to true before fetching
    axios
      .get(`http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPosts(res.data);
        setLoading(false); // Set loading to false after fetching is complete
      })
      .catch((err) => {
        setError("Failed to load posts.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [clubId]); // Make sure to refetch posts if clubId changes

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Book Club Posts
      </h2>
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-4">{error}</div>
      )}
      <ul className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available.</p>
        ) : (
          posts.map((post) => (
            <li
              key={post.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            >
              <BookClubPost post={post} clubId={clubId} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BookClubPostsList;
