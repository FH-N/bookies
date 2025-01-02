import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  // Fetch current user data (including user ID) after loading the token
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Current User Data:", response.data); // Check user data
          setCurrentUserId(response.data.id); // Set current user's ID
        })
        .catch((error) => {
          console.error("Error fetching current user data:", error);
        });
    }
  }, [token]);

  // Fetch users (authors/bookers) based on the current user ID
  useEffect(() => {
    if (currentUserId) {
      console.log("Fetching users, Current User ID:", currentUserId);
      axios
        .get(`http://localhost:8000/api/allusers/?user_id=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Fetched Users:", response.data);
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [currentUserId, token]);

  // Fetch following status for the current user
  useEffect(() => {
    if (currentUserId) {
      axios
        .get(`http://localhost:8000/api/followings/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const followings = response.data; // List of followed user IDs
          const status = {};
          followings.forEach((follow) => {
            status[follow.followed_user_id] = true;
          });
          setFollowingStatus(status);
        })
        .catch((error) => {
          console.error("Error fetching followings:", error);
        });
    }
  }, [currentUserId, token]);

  const handleFollowToggle = (authorId) => {
    const isFollowing = followingStatus[authorId];

    if (isFollowing) {
      // Unfollow API call
      axios
        .post(
          "http://localhost:8000/api/unfollow/",
          {
            user_id: currentUserId,
            followed_user_id: authorId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setFollowingStatus((prev) => ({ ...prev, [authorId]: false }));
        })
        .catch((error) => {
          console.error("Error unfollowing:", error);
        });
    } else {
      // Follow API call
      axios
        .post(
          "http://localhost:8000/api/follow/",
          {
            user_id: currentUserId,
            followed_user_id: authorId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setFollowingStatus((prev) => ({ ...prev, [authorId]: true }));
        })
        .catch((error) => {
          console.error("Error following:", error);
        });
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "left" }}>Authors and Bookers</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <li
              key={user.userid}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                textAlign: "left",
              }}
            >
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {user.role === "User" ? "Booker" : "Author"}
              </p>
              <p>
                <strong>Email:</strong> {user.email || "No email available"}
              </p>
              <p>
                <strong>Bio:</strong> {user.bio || "No bio available"}
              </p>
              <button
                onClick={() => handleFollowToggle(user.userid)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: followingStatus[user.userid]
                    ? "#dc3545"
                    : "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                {followingStatus[user.userid] ? "Unfollow" : "Follow"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AllUserListPage;
