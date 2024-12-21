import React, { useState, useEffect } from "react";
import axios from "axios";

const ReadingProgress = ({ bookId, totalPages }) => {
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [progressPercentage, setProgressPercentage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // To toggle the form visibility
  const [isPercentage, setIsPercentage] = useState(false); // Toggle between page number and percentage

  // Get the token from localStorage
  const token = localStorage.getItem("access");

  // Fetch user progress when the component mounts
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/progress/user/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Ensure that progressData is always an array
        setProgressData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError("Error fetching progress");
      }
    };
    fetchProgress();
  }, [token]);

  // Find the entry for the specific book
  const progressEntry = progressData.find(
    (entry) => entry.google_books_id === bookId
  );

  // Calculate the progress percentage
  const progress = progressEntry ? progressEntry.progress_percentage : 0;
  const currentProgress = progressEntry ? progressEntry.current_page : 0;

  const handleUpdateProgress = async (e) => {
    e.preventDefault();

    let data = {};

    // If editing by page number
    if (!isPercentage) {
      data = {
        google_books_id: bookId,
        current_page: parseInt(currentPage), // Current page from user input
      };
    } else {
      // If editing by percentage
      const page = Math.round(
        (parseFloat(progressPercentage) / 100) * totalPages
      );

      // Ensure that we don't send `null` or `undefined` for current_page
      if (isNaN(page) || page < 1 || page > totalPages) {
        console.log(page);
        setError("Invalid progress percentage");
        return;
      }

      data = {
        google_books_id: bookId,
        current_page: page, // Calculated page number from percentage
      };
    }

    try {
      // POST request to update the progress with the token
      await axios.post("http://127.0.0.1:8000/api/progress/update/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setError("");
      setCurrentPage("");
      setProgressPercentage("");
      setIsEditing(false); // Hide the form after submission

      // Refetch user progress after updating
      const response = await axios.get(
        "http://127.0.0.1:8000/api/progress/user/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProgressData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError("Error updating progress");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Display error message */}
      {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}

      {/* Display Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm font-medium">{progress.toFixed(2)}%</span>
      </div>

      {/* Button to toggle the edit progress form */}
      <button
        onClick={() => setIsEditing((prev) => !prev)}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        {isEditing ? "Cancel" : "Edit Progress"}
      </button>

      {/* Conditionally render the form to edit progress */}
      {isEditing && (
        <form onSubmit={handleUpdateProgress} className="mt-4 space-y-4">
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="pageNumber"
              checked={!isPercentage}
              onChange={() => setIsPercentage(false)}
              className="mr-2"
            />
            <label htmlFor="pageNumber" className="mr-4">
              Edit by Page Number
            </label>

            <input
              type="radio"
              id="percentage"
              checked={isPercentage}
              onChange={() => setIsPercentage(true)}
              className="mr-2"
            />
            <label htmlFor="percentage">Edit by Percentage</label>
          </div>

          {/* Conditional input fields based on selection */}
          {!isPercentage ? (
            <div>
              <label
                htmlFor="current_page"
                className="block text-sm font-medium text-gray-700"
              >
                Current Page
              </label>
              <input
                type="number"
                id="current_page"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="progress_percentage"
                className="block text-sm font-medium text-gray-700"
              >
                Progress Percentage
              </label>
              <input
                type="number"
                id="progress_percentage"
                value={progressPercentage}
                onChange={(e) => setProgressPercentage(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                required
                max="100"
                min="0"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Update Progress
          </button>
        </form>
      )}
    </div>
  );
};

export default ReadingProgress;
