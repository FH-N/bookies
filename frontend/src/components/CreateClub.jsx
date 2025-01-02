import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateClub = () => {
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]); // Available tags
  const [selectedTags, setSelectedTags] = useState([]); // User-selected tags
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch tags from the backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/clubtags/")
      .then((response) => {
        setTags(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch tags", err);
      });
  }, []);

  const handleTagChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value)); // Store selected tag IDs
      }
    }
    setSelectedTags(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token =
      localStorage.getItem("access") ||
      localStorage.getItem("google_access_token");

    if (!token) {
      alert("You must be logged in to create a book club.");
      return;
    }

    const clubData = {
      name: clubName,
      description: description,
      tag_ids: selectedTags,
    };

    axios
      .post("http://127.0.0.1:8000/api/bookclubs/", clubData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSuccess(true);
        setError(null);
        setClubName("");
        setDescription("");
        setSelectedTags([]);

        // Redirect to the new book club page after creation
        const clubId = response.data.id; // Assuming the club ID is returned in the response
        navigate(`/bookclubs/${clubId}`); // Redirect to the created club's page
      })
      .catch((err) => {
        setError("Failed to create book club");
        setSuccess(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg max-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Create a Book Club
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
          Club created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Club Name */}
        <div>
          <label
            htmlFor="clubName"
            className="block text-sm font-medium text-gray-700"
          >
            Club Name
          </label>
          <input
            type="text"
            id="clubName"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter club name"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter club description"
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags
          </label>
          <select
            id="tags"
            multiple
            value={selectedTags}
            onChange={handleTagChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold down <strong>Ctrl</strong> (Windows) or <strong>Cmd</strong>{" "}
            (Mac) to select multiple tags.
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Club
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClub;
