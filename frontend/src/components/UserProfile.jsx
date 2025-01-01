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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Edit Profile</h2>
      {success && <div style={{ color: "green" }}>{success}</div>}
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={profile.username}
          onChange={handleChange}
          disabled
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Role:</label>
        <select name="role" value={profile.role} onChange={handleChange}>
          <option value="User">User</option>
          <option value="Author">Author</option>
        </select>
      </div>
      <div>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows="4"
          style={{ width: "100%" }}
        ></textarea>
      </div>
      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Save
      </button>
    </div>
  );
};

export default UserProfile;
