import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./ui/Button";

const ReadingProgress = ({ bookId, totalPages, isEditing, setIsEditing }) => {
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [progressPercentage, setProgressPercentage] = useState("");
  const [isPercentage, setIsPercentage] = useState(false); // Toggle between page number and percentage

  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/progress/user/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProgressData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError("Error fetching progress");
      }
    };
    fetchProgress();
  }, [token]);

  const progressEntry = progressData.find(
    (entry) => entry.google_books_id === bookId
  );

  const progress = progressEntry ? progressEntry.progress_percentage : 0;
  const currentProgress = progressEntry ? progressEntry.current_page : 0;

  const handleUpdateProgress = async (e) => {
    e.preventDefault();

    let data = {};

    if (!isPercentage) {
      data = {
        google_books_id: bookId,
        current_page: parseInt(currentPage),
      };
    } else {
      const page = Math.round(
        (parseFloat(progressPercentage) / 100) * totalPages
      );
      if (isNaN(page) || page < 1 || page > totalPages) {
        setError("Invalid progress percentage");
        return;
      }
      data = {
        google_books_id: bookId,
        current_page: page,
      };
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/progress/update/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setError("");
      setCurrentPage("");
      setProgressPercentage("");
      setIsEditing(false);

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
    <div className={`container mx-auto p-6 ${isEditing ? "block" : "hidden"}`}>
      {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}

      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm font-medium">{progress.toFixed(2)}%</span>
      </div>

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

        <Button type="submit">Update Progress</Button>
      </form>
    </div>
  );
};

export default ReadingProgress;
