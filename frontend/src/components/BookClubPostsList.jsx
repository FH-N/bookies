import React, { useEffect, useState } from "react";
import axios from "axios";
import BookClubPost from "./BookClubPost";

const BookClubPostsList = ({ clubId }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // State to store filtered posts
  const [tags, setTags] = useState([]); // State for available tags
  const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
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
        setFilteredPosts(res.data); // Initially, show all posts
        setLoading(false); // Set loading to false after fetching is complete
      })
      .catch((err) => {
        setError("Failed to load posts.");
        setLoading(false);
      });
  };

  const fetchTags = () => {
    axios
      .get(`http://127.0.0.1:8000/api/posttags/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTags(res.data); // Assuming the response contains a list of tags
      })
      .catch((err) => {
        setError("Failed to load tags.");
      });
  };

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [clubId]); // Make sure to refetch posts and tags if clubId changes

  // Handle tag selection and filter posts by selected tags
  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        // If tag is already selected, remove it
        return prevSelectedTags.filter((item) => item !== tag);
      } else {
        // Otherwise, add the tag to selectedTags
        return [...prevSelectedTags, tag];
      }
    });
  };

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredPosts(posts); // If no tags are selected, show all posts
    } else {
      setFilteredPosts(
        posts.filter((post) =>
          post.post_tags.some((postTag) => selectedTags.includes(postTag.name))
        )
      );
    }
  }, [selectedTags, posts]); // Filter posts whenever selectedTags or posts change

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

      {/* Filter by tags (Checkboxes) */}
      <div className="mb-4 text-center">
        <p className="mb-2">Filter by Tags:</p>
        <div className="space-x-4">
          {tags.map((tag) => (
            <label key={tag.id} className="inline-flex items-center">
              <input
                type="checkbox"
                value={tag.name}
                checked={selectedTags.includes(tag.name)}
                onChange={() => handleTagChange(tag.name)}
                className="mr-2"
              />
              {tag.name}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-4">{error}</div>
      )}
      <ul className="space-y-4">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available.</p>
        ) : (
          filteredPosts.map((post) => (
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
