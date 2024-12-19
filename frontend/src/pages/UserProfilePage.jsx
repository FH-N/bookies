import React from "react";
import UserProfile from  "../components/UserProfile";
import FollowingStats from "../components/FollowingStats";

const UserProfilePage = () => {
  return (
    <div>
        <FollowingStats></FollowingStats>
      <h1>User Profile Page</h1>
      <UserProfile  username={"qqq"} />
    </div>
  );
};

export default UserProfilePage;