import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FollowingStats = () => {
  const currentUserId = localStorage.getItem("user_id"); // Get the current user ID from localStorage
  const [stats, setStats] = useState({
    following_count: 0,
    followers_count: 0,
  });
  const [loading, setLoading] = useState(true);

  console.log("http://localhost:8000/api/followingstats/" + currentUserId);

  useEffect(() => {
    if (!currentUserId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    // Fetch following stats for the current user
    axios
      .get(`http://localhost:8000/api/following-stats/${currentUserId}`)
      .then((response) => {
        setStats(response.data); // Set the fetched stats
        console.log(response.data);
        setLoading(false); // Stop the loading state
      })
      .catch((error) => {
        console.error("Error fetching following stats:", error);
        setLoading(false);
      });
  }, [currentUserId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center mt-5">
      <h2 className="text-2xl font-semibold mb-4">Following Stats</h2>
      <p className="mb-2">
        <Link
          to="/allusers"
          className="text-blue-600 underline hover:text-blue-800 font-bold"
        >
          All Users
        </Link>
      </p>
      <p className="mb-2">
        <strong>Following:</strong>{" "}
        <Link
          to="/myfollowings"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {stats.following_count}
        </Link>
      </p>
      <p>
        <strong>Followers:</strong>{" "}
        <Link
          to="/myfollowers"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {stats.followers_count}
        </Link>
      </p>
    </div>
  );
};

export default FollowingStats;
