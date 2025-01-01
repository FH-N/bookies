import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "User",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [userid, setUserid] = useState("");

  function decodeToken(token) {
    const payloadBase64 = token.split(".")[1]; // Extract the payload part
    const decodedPayload = atob(payloadBase64); // Decode Base64 string
    return JSON.parse(decodedPayload); // Parse JSON payload
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      const decodedToken = decodeToken(accessToken);
      if (decodedToken) {
        setUserid(decodedToken.user_id); // Adjust to match token payload
      }
    } else {
      setError("No access token found.");
    }
  }, []);

  useEffect(() => {
    if (userid) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:8000/api/user/?user_id=${userid}`
          );
          if (response && response.data) {
            setProfile(response.data);
          } else {
            setError("User profile data is missing.");
          }
        } catch (err) {
          setError("Failed to load user profile.");
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [userid]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle form submission (save profile)
  const handleSave = async () => {
    try {
      setSuccess(false);
      setError(null);
      const res = await axios.post(
        "http://localhost:8000/api/update-user/",
        profile
      );
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-700">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Edit Profile
      </h2>
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={profile.username}
          onChange={handleChange}
          disabled
          className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Email:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          disabled
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Role:</label>
        <select
          name="role"
          value={profile.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="User">User</option>
          <option value="Author">Author</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Bio:</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 rounded-lg p-2"
        ></textarea>
      </div>
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
};

export default UserProfile;
