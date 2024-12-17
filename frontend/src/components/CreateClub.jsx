import React, { useState } from "react";
import axios from "axios";

const CreateClub = () => {
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access"); // Retrieve access token

    if (!token) {
      alert("You must be logged in to create a book club.");
      return;
    }

    // Form data to be sent to the backend
    const clubData = {
      name: clubName,
      description: description,
    };

    // Sending POST request to create the book club
    axios
      .post("http://127.0.0.1:8000/api/bookclubs/", clubData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in headers
        },
      })
      .then((response) => {
        setSuccess(true);
        setError(null);
        setClubName(""); // Reset form
        setDescription("");
      })
      .catch((err) => {
        setError("Failed to create book club");
        setSuccess(false);
      });
  };

  return (
    <div className="create-club-container">
      <h2>Create a Book Club</h2>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Club created successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="create-club-form">
        <div>
          <label htmlFor="clubName">Club Name</label>
          <input
            type="text"
            id="clubName"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Club</button>
      </form>
    </div>
  );
};

export default CreateClub;
