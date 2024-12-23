import React, { useEffect, useState } from "react";
import axios from "axios";

const MyFollowingsPage = () => {
  const [users, setUsers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({}); // Track follow/unfollow status for each user
  const currentUserId = localStorage.getItem("user_id"); // Get the current user ID from localStorage

  useEffect(() => {
    // Fetch authors from the API
    //console.log('URL : ' + 'http://localhost:8000/api/allusers/?user_id=' + currentUserId  );
    axios
      .get(`http://localhost:8000/api/followings/${currentUserId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching authors:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch following status for the current user
    axios
      .get(`http://localhost:8000/api/followings/${currentUserId}`)
      .then((response) => {
        const followings = response.data; // List of followed user IDs
        const status = {};
        followings.forEach((follow) => {
          console.log("followed" + follow);
          status[follow.followed_user_id] = true;
        });
        setFollowingStatus(status);
      })
      .catch((error) => {
        console.error("Error fetching followings:", error);
      });
  }, [currentUserId]);

  const handleFollowToggle = (authorId) => {
    const isFollowing = followingStatus[authorId];

    if (isFollowing) {
      // Unfollow API call
      axios
        .post("http://localhost:8000/api/unfollow/", {
          user_id: currentUserId,
          followed_user_id: authorId,
        })
        .then(() => {
          setFollowingStatus((prev) => ({ ...prev, [authorId]: false }));
        })
        .catch((error) => {
          console.error("Error unfollowing:", error);
        });
    } else {
      // Follow API call
      axios
        .post("http://localhost:8000/api/follow/", {
          user_id: currentUserId,
          followed_user_id: authorId,
        })
        .then(() => {
          setFollowingStatus((prev) => ({ ...prev, [authorId]: true }));
        })
        .catch((error) => {
          console.log("author_id: " + authorId);
          console.error("Error following:", error);
        });
    }
  };

  return (
    <div className="container flex flex-col w-full min-h-screen">
      <h1 style={{ textAlign: "left" }}>My Followings</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.followed_user_id}
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
              <strong>Type:</strong> {user.role == "User" ? "Booker" : "Author"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "No email available"}
            </p>
            <p>
              <strong>Bio:</strong> {user.bio || "No bio available"}
            </p>
            <button
              onClick={() => handleFollowToggle(user.followed_user_id)}
              style={{
                padding: "5px 10px",
                backgroundColor: followingStatus[user.followed_user_id]
                  ? "#dc3545"
                  : "#007BFF", // Red for unfollow, blue for follow
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              {followingStatus[user.followed_user_id] ? "Unfollow" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyFollowingsPage;
