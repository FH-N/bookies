import React, { useEffect, useState } from "react";
import axios from "axios";

const MyFollowersPage = () => {
  const [users, setUsers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({}); // Track follow/unfollow status for each user
  const currentUserId = localStorage.getItem("user_id"); // Get the current user ID from localStorage

  useEffect(() => {
    // Fetch followers from the API
    axios
      .get(`http://localhost:8000/api/followers/${currentUserId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching followers:", error);
      });
  }, []);

  return (
    <div className="container mx-auto mt-8 px-4 w-full h-full min-h-screen font-poppins text-white">
      <h1 className="text-2xl font-bold mb-6">My Followers</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.followed_user_id}
            className="p-4 border border-gray-300 rounded-lg shadow-sm"
          >
            <p className="text-lg font-semibold">
              <span className="font-bold">Username:</span> {user.username}
            </p>
            <p className="">
              <span className="font-bold">Type:</span>{" "}
              {user.role === "User" ? "Booker" : "Author"}
            </p>
            <p className="">
              <span className="font-bold">Email:</span>{" "}
              {user.email || "No email available"}
            </p>
            <p className="">
              <span className="font-bold">Bio:</span>{" "}
              {user.bio || "No bio available"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyFollowersPage;
