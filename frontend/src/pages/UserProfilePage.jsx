import React from "react";
import UserProfile from "../components/UserProfile";
import FollowingStats from "../components/FollowingStats";

const UserProfilePage = () => {
  return (
    <div className="container min-h-screen w-full text-white">
      <FollowingStats />
      <h1>User Profile Page</h1>
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
