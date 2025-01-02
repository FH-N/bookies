import React from "react";
import useFollowings from "../hooks/useFollowings";

const MyFollowingsPage = () => {
  const currentUserId = localStorage.getItem("user_id");
  const { users, followingStatus, toggleFollow } = useFollowings(currentUserId);

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
              onClick={() => toggleFollow(user.followed_user_id)}
              style={{
                padding: "5px 10px",
                backgroundColor: followingStatus[user.followed_user_id]
                  ? "#dc3545"
                  : "#007BFF",
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
