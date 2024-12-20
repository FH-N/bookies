import React, { useState, useEffect } from "react";
import RecommendedCategory from "../components/RecommendedCategory";

const RecommendationPage = () => {
  return (
    <div className="container flex flex-col w-full min-h-screen">
      <h1 className="text-4xl text-white font-poppins font-extrabold py-8">
        {" "}
        Discover your next read!
      </h1>
      <RecommendedCategory searchTerm="Science Fiction" />
      <RecommendedCategory searchTerm="Romance" />
      <RecommendedCategory searchTerm="Mystery" />
      <RecommendedCategory searchTerm="Psychology" />
    </div>
  );
};

export default RecommendationPage;
