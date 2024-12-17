import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookClubList = () => {
  const [bookClubs, setBookClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  // Fetch book clubs
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/bookclubs/")
      .then((response) => {
        setBookClubs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching book clubs");
        setLoading(false);
      });
  }, []);

  // Handle joining a book club
  const handleJoinBookClub = (clubId) => {
    const token = localStorage.getItem("access");

    axios
      .post(
        `http://127.0.0.1:8000/api/bookclubs/join/${clubId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(response.data.message); // Show success message
      })
      .catch((err) => {
        alert("Error joining book club");
      });
  };

  // Navigate to BookClubDetails when clicked
  const handleNavigateToDetails = (clubId) => {
    navigate(`/bookclub/${clubId}`);
  };

  if (loading) {
    return <div>Loading book clubs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book Clubs</h2>
      <ul className="space-y-4">
        {bookClubs.map((club) => (
          <li
            key={club.id}
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => handleNavigateToDetails(club.id)} // Add click handler
          >
            <h3 className="text-xl font-semibold">{club.name}</h3>
            <p>{club.description}</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click event
                handleJoinBookClub(club.id);
              }}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Join Club
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookClubList;
