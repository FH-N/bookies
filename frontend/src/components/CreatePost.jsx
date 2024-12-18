import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePost = ({ clubId }) => {
  const [newPost, setNewPost] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tag IDs
  const [availableTags, setAvailableTags] = useState([]); // Store fetched tags
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  // Fetch available tags from the API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/posttags/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAvailableTags(res.data))
      .catch(() => setError("Failed to fetch tags."));
  }, [token]);

  const handlePostSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/`,
        { content: newPost, post_tags: selectedTags }, // Send tag IDs
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setNewPost("");
        setSelectedTags([]); // Clear tags after posting
      })
      .catch(() => setError("Failed to create post."));
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
      <h3 className="text-xl font-semibold mb-4">Create a New Post</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handlePostSubmit} className="space-y-4">
        {/* Post Content */}
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write your post here..."
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 resize-none"
          rows="4"
        />

        {/* Available Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Tags
          </label>
          <ul className="flex flex-wrap gap-2 mt-2">
            {availableTags.map((tag) => (
              <li
                key={tag.id}
                onClick={() => toggleTag(tag.id)} // Toggle tag selection by ID
                className={`cursor-pointer px-2 py-1 rounded text-sm ${
                  selectedTags.includes(tag.id)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
