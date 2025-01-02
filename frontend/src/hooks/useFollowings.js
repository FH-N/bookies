import { useState, useEffect } from "react";
import axios from "axios";

const useFollowings = (currentUserId) => {
  const [users, setUsers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    if (!currentUserId) return;

    axios
      .get(`http://localhost:8000/api/followings/${currentUserId}`)
      .then((response) => {
        const followings = response.data;

        setUsers(followings);

        const status = {};
        followings.forEach((follow) => {
          status[follow.followed_user_id] = true;
        });

        setFollowingStatus(status);
      })
      .catch((error) => {
        console.error("Error fetching followings:", error);
      });
  }, [currentUserId]);

  const toggleFollow = (authorId) => {
    const isFollowing = followingStatus[authorId];

    const endpoint = isFollowing
      ? "http://localhost:8000/api/unfollow/"
      : "http://localhost:8000/api/follow/";

    const payload = {
      user_id: currentUserId,
      followed_user_id: authorId,
    };

    axios
      .post(endpoint, payload)
      .then(() => {
        setFollowingStatus((prev) => ({
          ...prev,
          [authorId]: !isFollowing,
        }));
      })
      .catch((error) => {
        console.error(
          `Error ${isFollowing ? "unfollowing" : "following"} user:`,
          error
        );
      });
  };

  return { users, followingStatus, toggleFollow };
};

export default useFollowings;
