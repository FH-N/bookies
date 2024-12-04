import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationList from "../components/RecommendationList";

const API_ENDPOINT = "https://www.googleapis.com/books/v1/volumes?q=";

const RecommendationPage = () => {
  const [categories] = useState(["Science Fiction", "History", "Romance"]);
  const [recommendationData, setRecommendationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allResults = {};
        for (const category of categories) {
          const url = `${API_ENDPOINT}${category}`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(
              `Error fetching books for category '${category}': Status Code ${response.status}`
            );
          }

          const data = await response.json();
          const books = data?.items || [];
          allResults[category] = books.slice(0, 3);
        }

        setRecommendationData(allResults);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchClick = () => {
    navigate("/search"); // Navigate to the SearchPage route
  };

  if (isLoading) {
    return <p>Loading recommendations...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="recommendation-page">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold m-2">Book Recommendations</h1>
        <button
          onClick={handleSearchClick}
          className="text-sm bg-blue-500 py-2 px-4 rounded text-white"
        >
          Search
        </button>
      </div>
      <RecommendationList booksByCategory={recommendationData} />
    </div>
  );
};

export default RecommendationPage;
