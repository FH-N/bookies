import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCurrentUserId(response.data.id);
        })
        .catch((error) => {
          console.error("Error fetching current user data:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (currentUserId) {
      axios
        .get(`http://localhost:8000/api/allusers/?user_id=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [currentUserId, token]);

  useEffect(() => {
    if (currentUserId) {
      axios
        .get(`http://localhost:8000/api/followings/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const followings = response.data;
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
    const apiUrl = isFollowing
      ? "http://localhost:8000/api/unfollow/"
      : "http://localhost:8000/api/follow/";
    const payload = {
      user_id: currentUserId,
      followed_user_id: authorId,
    };

    axios
      .post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setFollowingStatus((prev) => ({
          ...prev,
          [authorId]: !isFollowing,
        }));
      })
      .catch((error) => {
        console.error(`Error toggling follow status:`, error);
      });
  };

  return (
    <div className="container mx-auto mt-8 px-4 text-white w-full h-full min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Authors and Bookers</h1>
      <ul className="space-y-4">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <li
              key={user.userid}
              className="p-4 border border-white rounded-lg shadow-sm "
            >
              <p className="text-lg font-semibold">
                <span className="font-bold">Username:</span> {user.username}
              </p>
              <p>
                <span className="font-bold">Type:</span>{" "}
                {user.role === "User" ? "Booker" : "Author"}
              </p>
              <p>
                <span className="font-bold">Email:</span>{" "}
                {user.email || "No email available"}
              </p>
              <p>
                <span className="font-bold">Bio:</span>{" "}
                {user.bio || "No bio available"}
              </p>
              <button
                onClick={() => handleFollowToggle(user.userid)}
                className={`px-4 py-2 mt-4 rounded ${
                  followingStatus[user.userid]
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white font-bold`}
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
